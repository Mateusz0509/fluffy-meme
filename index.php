<?php
$config = require __DIR__ . '/config.php';
$pdo = null;
try {
  $pdo = new PDO(
    "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
    $config['db_user'],
    $config['db_pass'],
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
  );
} catch (Exception $e) {}

$success = false;
$error = '';
$quote = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = trim($_POST['name'] ?? '');
  $email = trim($_POST['email'] ?? '');
  $phone = trim($_POST['phone'] ?? '');
  $nip = trim($_POST['nip'] ?? '');
  $product = trim($_POST['product'] ?? '');
  $qty = trim($_POST['qty'] ?? '');
  $address = trim($_POST['address'] ?? '');
  $notes = trim($_POST['notes'] ?? '');

  if ($name === '' || $phone === '' || $address === '') {
    $error = 'Uzupełnij wymagane pola.';
  } else {
    $stmt = $pdo ? $pdo->prepare('INSERT INTO orders (name,email,phone,nip,product,qty,address,notes,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,NOW())') : null;
    if ($stmt) {
      $stmt->execute([$name,$email,$phone,$nip,$product,$qty,$address,$notes,'new']);
      $orderId = $pdo->lastInsertId();
    } else {
      $orderId = 'TMP' . time();
    }

    $message = "Nowe zamówienie #$orderId
Imię/Firma: $name
Email: $email
Telefon: $phone
NIP: $nip
Produkt: $product
Ilość: $qty
Adres: $address
Uwagi: $notes";
    @mail($config['email_to'], 'Nowe zamówienie Sosnowe Chwile', $message);
    $wa = 'https://wa.me/' . $config['whatsapp_number'] . '?text=' . rawurlencode($message . '\nKonto: ' . $config['bank_account']);
    $success = true;
    $quote = ['id'=>$orderId,'wa'=>$wa];
  }
}
?>
<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Sosnowe Chwile - Zamówienie</title><style>body{font-family:Arial,sans-serif;background:#f5f0e6;margin:0}.wrap{max-width:980px;margin:40px auto;padding:20px}.card{background:#fff;border:1px solid #e7dfcf;border-radius:18px;padding:20px;box-shadow:0 10px 30px rgba(0,0,0,.06)}input,textarea,select,button,a{font:inherit}.grid{display:grid;gap:12px}.two{display:grid;grid-template-columns:1fr;gap:12px}label{display:grid;gap:6px;color:#223117;font-weight:700}input,textarea,select{padding:12px;border:1px solid #d8cfbe;border-radius:12px}.btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 16px;border-radius:12px;border:0;background:#324b25;color:#fff;text-decoration:none}.ok{background:#eaf4df;padding:12px;border-radius:12px}.err{background:#fde8e8;padding:12px;border-radius:12px}.small{color:#666;font-size:14px}@media(min-width:760px){.two{grid-template-columns:1fr 1fr}}</style></head><body><div class="wrap"><div class="card"><h1>Sosnowe Chwile</h1><p class="small">Formularz zamówienia, faktura, WhatsApp i e-mail.</p><?php if($success): ?><div class="ok">Zamówienie zapisane. <a class="btn" href="<?= htmlspecialchars($quote['wa']) ?>" target="_blank" rel="noopener">Wyślij na WhatsApp</a></div><?php endif; if($error): ?><div class="err"><?= htmlspecialchars($error) ?></div><?php endif; ?><form method="post" class="grid"><div class="two"><label>Imię i nazwisko / firma<input name="name" required></label><label>Email<input name="email" type="email"></label></div><div class="two"><label>Telefon<input name="phone" required></label><label>NIP<input name="nip"></label></div><div class="two"><label>Produkt<select name="product"><option>Standard</option><option>Economy</option><option>Premium Plus</option><option>Premium A1</option></select></label><label>Ilość<select name="qty"><option>1 paleta</option><option>2-3 palety</option><option>4-9 palet</option><option>10+ palet</option></select></label></div><label>Adres dostawy<textarea name="address" rows="3" required></textarea></label><label>Uwagi<textarea name="notes" rows="3"></textarea></label><button class="btn" type="submit">Zapisz zamówienie</button></form></div></div></body></html>

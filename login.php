<?php
session_start();
$config = require __DIR__ . '/config.php';
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $u = $_POST['username'] ?? '';
  $p = $_POST['password'] ?? '';
  if ($u === 'admin' && $p === 'admin123') {
    $_SESSION['admin'] = true;
    header('Location: admin.php'); exit;
  }
  $error = 'Błędny login lub hasło';
}
?><!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Logowanie</title><style>body{font-family:Arial,sans-serif;background:#f5f0e6;margin:0;display:grid;place-items:center;min-height:100vh}.box{background:#fff;padding:24px;border:1px solid #ddd;border-radius:16px;width:min(420px,92vw)}input,button{width:100%;padding:12px;margin-top:10px}.err{background:#fde8e8;padding:10px;border-radius:10px}</style></head><body><form class="box" method="post"><h1>Panel admin</h1><?php if($error): ?><div class="err"><?= htmlspecialchars($error) ?></div><?php endif; ?><input name="username" placeholder="Login"><input type="password" name="password" placeholder="Hasło"><button type="submit">Zaloguj</button></form></body></html>

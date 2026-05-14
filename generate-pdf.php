<?php
require __DIR__ . '/vendor/autoload.php';
use Mpdf\Mpdf;

$config = require __DIR__ . '/config.php';
$orderId = $_GET['order'] ?? 'NEW';
$client = $_GET['client'] ?? 'Klient';
$product = $_GET['product'] ?? 'Pellet';
$qty = $_GET['qty'] ?? '1 paleta';
$amount = $_GET['amount'] ?? '0';
$date = date('Y-m-d');
$invoiceNo = 'ZAL-' . date('Ymd') . '-' . substr((string)time(), -4);

$html = '<html><head><style>body{font-family:DejaVu Sans, sans-serif;font-size:12pt} .box{border:1px solid #333;padding:18px} h1{margin-top:0;color:#223117} .row{margin:6px 0}</style></head><body>';
$html .= '<div class="box">';
$html .= '<h1>Faktura zaliczkowa</h1>';
$html .= '<div class="row"><strong>Numer:</strong> '.$invoiceNo.'</div>';
$html .= '<div class="row"><strong>Data:</strong> '.$date.'</div>';
$html .= '<div class="row"><strong>Sprzedawca:</strong> '.htmlspecialchars($config['company_name']).'</div>';
$html .= '<div class="row"><strong>Nr konta:</strong> '.htmlspecialchars($config['bank_account']).'</div>';
$html .= '<div class="row"><strong>Odbiorca:</strong> '.htmlspecialchars($client).'</div>';
$html .= '<div class="row"><strong>Produkt:</strong> '.htmlspecialchars($product).'</div>';
$html .= '<div class="row"><strong>Ilość:</strong> '.htmlspecialchars($qty).'</div>';
$html .= '<div class="row"><strong>Kwota zaliczki:</strong> '.htmlspecialchars($amount).' zł</div>';
$html .= '<div class="row"><strong>Opis:</strong> Zaliczka za zamówienie '.$orderId.'</div>';
$html .= '</div></body></html>';

$mpdf = new Mpdf();
$mpdf->WriteHTML($html);
$mpdf->Output('faktura-zaliczkowa-'.$invoiceNo.'.pdf', 'I');

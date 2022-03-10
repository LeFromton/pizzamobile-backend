<?php
switch ($_SERVER['REQUEST_METHOD']) {
  case 'GET':
    $data = getCurrentOrders();
    break;

  case 'POST':
    $rqData = json_decode(file_get_contents('php://input'), true);
    if(!empty($rqData)){
      switch($_REQUEST['location']){
        case 'checkin':
          switch($_REQUEST['action']){
            case 'new':
              foreach($rqData['ctRoot'] as $order){
                writeOrder($order, '../db/new-orders.csv');
              }
              $data = getCurrentOrders();
              break;
            case 'confirm':
              foreach($rqData['ctRoot'] as $order){
                writeOrder($order, '../db/payed-orders.csv');
              }
              // Todo : Remove from new-orders
              break;
          }
          break;
        case 'kitchen':
          switch($_REQUEST['action']){
            case 'finish':
              foreach($rqData['ctRoot'] as $order){
                writeOrder($order, '../db/new-orders.csv');
              }
              $data = getCurrentOrders();
              break;
            case 'check-status':
              foreach($rqData['ctRoot'] as $order){
                writeOrder($order, '../db/payed-orders.csv');
              }
              // Todo : Remove from new-orders
              break;
            case 'confirm-oven':
              foreach($rqData['ctRoot'] as $order){
                writeOrder($order, '../db/cooking-orders.csv');
              }
              // Todo : Remove from new-orders
              break;
          }
          break;
        case 'hand-off':
          break;
        default:
          break;
      }
    }else{
      $data = 'empty data';
    }
    break;
  default:
    $data = 'ntm';
    break;
}

if(!empty($data)){
  echo json_encode($data, JSON_FORCE_OBJECT);
} else {
  echo 'ntm';
}

function removeOrder(array $order, string $path){
  
}

function writeOrder(array $order, $table){
  $db = mysqli_connect("localhost:4439", "SA", "EXPRESS12345678", "PizzamobileDB");
  $query = "INSERT INTO ? (Name, Phone, Pizzas, Status) VALUES (?, ?, ?, ?);";
  $stmt = mysqli_prepare($db, $query);
  mysqli_stmt_bind_param($stmt, 'ssss', $table, $order['name'], $order['phone'], $order['pizzas'], $order['status']);
  mysqli_stmt_execute($stmt);
  mysqli_stmt_close($stmt);
  mysqli_close($db);
}

function getCurrentOrders(): array {
  $db = mysqli_connect("localhost:4439", "SA", "EXPRESS12345678", "PizzamobileDB");
  $stmt = mysqli_query($db, "SELECT * FROM Orders");
  $result = mysqli_fetch_all($stmt, MYSQLI_ASSOC);
  mysqli_close($db);
  return $result;
}
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
                $db = mysqli_connect("localhost:4439", "root", "EXPRESS12345678", "PizzaMobileDB");
                $stmt = mysqli_prepare($db, "INSERT INTO Orders (Name, Phone, Pizzas, Status) VALUES (?, ?, ?, 'new');");
                mysqli_stmt_bind_param($stmt, 'sss', $order['name'], $order['phone'], $order['pizzas']);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_close($stmt);
                mysqli_close($db);
              }
              // Todo return ID
              break;
            case 'confirm':
              foreach($rqData['ctRoot'] as $order){
                $db = mysqli_connect("localhost:4439", "root", "EXPRESS12345678", "PizzaMobileDB");
                $stmt = mysqli_prepare($db, "UPDATE Orders SET Status = 'paid' WHERE Id = ?");
                mysqli_stmt_bind_param($stmt, 's', $order['id']);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_close($stmt);
                mysqli_close($db);
              }
              // Todo : Payment confirmation
              break;
          }
          break;
        case 'kitchen':
          switch($_REQUEST['action']){
            case 'confirm-oven':
              foreach($rqData['ctRoot'] as $order){
                $db = mysqli_connect("localhost:4439", "root", "EXPRESS12345678", "PizzaMobileDB");
                $stmt = mysqli_prepare($db, "UPDATE Orders SET Status = 'cooking' WHERE Id = ?");
                mysqli_stmt_bind_param($stmt, 's', $order['id']);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_close($stmt);
                mysqli_close($db);
              }
              // Todo : Timestamp mechanic synchro
              break;
            case 'finish':
              foreach($rqData['ctRoot'] as $order){
                $db = mysqli_connect("localhost:4439", "root", "EXPRESS12345678", "PizzaMobileDB");
                $stmt = mysqli_prepare($db, "UPDATE Orders SET Status = 'finished' WHERE Id = ?");
                mysqli_stmt_bind_param($stmt, 's', $order['id']);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_close($stmt);
                mysqli_close($db);
              }
              break;
            case 'check-status':
              foreach($rqData['ctRoot'] as $order){
                $db = mysqli_connect("localhost:4439", "root", "EXPRESS12345678", "PizzaMobileDB");
                $stmt = mysqli_prepare($db, "UPDATE Orders SET Status = 'finished' WHERE Id = ?");
                mysqli_stmt_bind_param($stmt, 's', $order['id']);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_close($stmt);
                mysqli_close($db);
              }
              // Todo : Remove from new-orders
              break;
          }
          break;
        case 'handoff':
          foreach($rqData['ctRoot'] as $order){
            $db = mysqli_connect("localhost:4439", "root", "EXPRESS12345678", "PizzaMobileDB");
            $stmt = mysqli_prepare($db, "INSERT INTO LogOrders SELECT Id, Name, Phone, Pizzas FROM Orders WHERE Id=?");
            $stmt2 = mysqli_prepare($db, "DELETE FROM Orders WHERE Id=?");
            mysqli_stmt_bind_param($stmt, 's', $order['id']);
            mysqli_stmt_bind_param($stmt2, 's', $order['id']);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_execute($stmt2);
            mysqli_stmt_close($stmt);
            mysqli_close($db);
          }
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

function updateStatus() {
  
}

function getCurrentOrders(): array {
  $db = mysqli_connect("localhost:4439", "root", "EXPRESS12345678", "PizzaMobileDB");
  $stmt = mysqli_query($db, "SELECT * FROM Orders");
  $result = mysqli_fetch_all($stmt, MYSQLI_ASSOC);
  mysqli_close($db);
  return $result;
}
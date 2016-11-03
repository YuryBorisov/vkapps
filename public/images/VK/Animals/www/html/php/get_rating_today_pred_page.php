<?php 
if(isset($_POST['id_page'])){
    include('../db.php');
    $limit_start = 8 * $_POST['id_page'] - 8; 
    $limit_end = 8;
    $line_next_query = "SELECT  `vk_users`.`id_vk` , COUNT(`firs`.`id_user`) FROM  `firs` LEFT JOIN  `vk_users` ON  `firs`.`id_user` =  `vk_users`.`id` WHERE `firs`.`date` = CURDATE() GROUP BY  `firs`.`id_user` ORDER BY COUNT(  `vk_users`.`id` ) DESC LIMIT ".$limit_start.", ".$limit_end;
    $query = mysqli_query($link, $line_next_query);
    $response = "";
 while ($row = mysqli_fetch_assoc($query))
  {
     $response .= $row['id_vk']. ":".$row["COUNT(`firs`.`id_user`)"]."+";
  }
echo $response;
mysqli_close($link);
}
?>
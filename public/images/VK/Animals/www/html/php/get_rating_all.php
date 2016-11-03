<?php
include('../db.php');
$today = "SELECT  `vk_users`.`id_vk` , COUNT(`firs`.`id_user`) FROM  `firs` LEFT JOIN  `vk_users` ON  `firs`.`id_user` =  `vk_users`.`id` GROUP BY  `firs`.`id_user` ORDER BY COUNT(  `vk_users`.`id` ) DESC LIMIT 8";
$quert_today = mysqli_query($link,$today);
$response;
while ($row = mysqli_fetch_assoc($quert_today))
{
    $response .= $row['id_vk']. ":".$row["COUNT(`firs`.`id_user`)"]."+";
}
echo $response;
mysqli_close($link);
?>
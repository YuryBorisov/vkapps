<?php
if(isset($_POST['data'])){
   $arr = explode(',',$_POST['data']); 
   include('../db.php'); 
   $ids_users = "";
   $count = count($arr);
   for($i = 0; $i < $count; $i++){
       if(($i + 1) == $count){
         $ids_users .= "id_vk=".$arr[$i];
       }else{
       $ids_users .= "id_vk=".$arr[$i]." OR ";
       }
   } 
   $line_get_id_users = "SELECT id FROM vk_users WHERE ".$ids_users; 
   $query_get_id_users = mysqli_query($link, $line_get_id_users); 
   $ids_user_friends = ""; 
   while ($row = mysqli_fetch_assoc($query_get_id_users))
   {
     $ids_user_friends .= "`firs`.`id_user` = ".$row['id']. " OR ";
   } 
   $ids_user_friends = substr($ids_user_friends, 0, -3); 
   $line_firs_users = "SELECT  `vk_users`.`id_vk` , COUNT(`firs`.`id_user`) FROM  `firs` LEFT JOIN  `vk_users` ON  `firs`.`id_user` =  `vk_users`.`id` WHERE  ".$ids_user_friends." GROUP BY  `firs`.`id_user` ORDER BY COUNT(  `vk_users`.`id` ) DESC LIMIT 8";
   $quert_firs_users = mysqli_query($link, $line_firs_users);
    $response = "";
   while ($row = mysqli_fetch_assoc($quert_firs_users))
   {
    $response .= $row['id_vk']. ":".$row["COUNT(`firs`.`id_user`)"]."+";
   }
   $response = substr($response, 0, -1); 
   echo $response; 
   mysqli_close($link);
}
?>
<?php
if(isset($_POST['vk_id'])){ 
include('../db.php');  
   $query = mysqli_query($link, "SELECT id FROM vk_users WHERE id_vk='".$_POST['vk_id']."'");
   $array_query = mysqli_fetch_array($query);
   $query_firs = mysqli_query($link, "SELECT id FROM firs WHERE id_user='".$array_query['id']."'");
   if($query_firs){
       echo mysqli_num_rows($query_firs);
   }else{
      echo 'error';
}
   mysqli_close($link);
}  
?>
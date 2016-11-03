<?php
if(isset($_POST['vk_id'])){ 
include('../db.php');  
   $array = mysqli_fetch_array(mysqli_query($link, "SELECT id FROM vk_users WHERE id_vk='".$_POST['vk_id']."'"));
   mysqli_query($link,"INSERT INTO `firs` (`id_user`, `date`) VALUES ('".$array['id']."', '".date("Y-m-d")."')");
   mysqli_close($link);
}  
?>
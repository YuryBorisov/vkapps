<?php
if(isset($_POST['vk_id'])){ 
include('../db.php');  
if(mysqli_num_rows(mysqli_query($link, "SELECT id FROM vk_users WHERE id_vk='".$_POST['vk_id']."' LIMIT 1")) == 0){
    if(mysqli_query($link, "INSERT INTO vk_users(id_vk, date) VALUES('".$_POST['vk_id']."','".date("Y-m-d")."')")){
       echo 0;   
    }else{
       echo -1;
    }
}else{
 echo 111;
}
mysqli_close($link);
}
?>
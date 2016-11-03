<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="/css/app.css" />
    <script type="text/javascript" src="/js/jquery-2.0.0.min.js"></script>
    <script type="text/javascript" src="js/jqueryrotate.2.1.js"></script>
    <script src="//vk.com/js/api/xd_connection.js?2" type="text/javascript"></script>

    <script>
        $(document).ready(function() {
            VK.api("users.get", {
                fields: "id,photo_100,first_name,last_name"
            }, function(data) {
                $('#avatar img').attr('src', data.response[0].photo_100);
                $('#first_name').text(data.response[0].first_name);
                $('#last_name').text(data.response[0].last_name);
                var data_game = {
                    vk_id: data.response[0].uid
                };
                $.ajax({
                    url: 'php/is_vk_user.php',
                    type: 'post',
                    data: data_game,
                    success: function(resualt) {
                        if (resualt == 0) {
                            $('.word').html("<div id='info' style='width:480px; height:340px;'></div><div id='bat'></div>")
                        } else if (resualt == 111) {
                            $('.word').html("<div id='info' style='width:480px; height:340px;'></div><div id='bat'></div>");
                            $('#info').css('background-image', "url('/images/comeback.png')")
                        }
                    }
                });
                $.ajax({
                    url: 'php/firs.php',
                    type: 'post',
                    data: data_game,
                    success: function(resualt) {
                        $('#stolb div').text(resualt);
                        if (resualt == 0 || resualt == 1 || resualt == 2) {
                            resualt = 3
                        }
                        $('#lvl button').text(parseFloat((resualt / 3).toFixed(1)))
                    }
                })
            });
            var date = new Date();
            var d = date.getHours();
            if ((d >= 0 || d <= 8)) {
                $('.fon').css("background-image", "url('../images/stsena_mal_noch.jpg')");
                $('#snegovik img').attr("src", "/images/snegovik_noch.png");
                $('#avatar').css("background-image", "url('../images/avatar_light.png')")
            } else {
                $('.fon').css("background-image", "url('../images/stsena.jpg')");
                $('#snegovik img').attr("src", "/images/snegovik.png");
                $('#avatar').css("background-image", "url('../images/avatar.png')")
            }
            $(document).on("click", "#bat", function() {
                $('#info').remove();
                $(this).remove();
                $('.word').html("<button id='game_start'>ИГРАТЬ</button>");
                $('#game_start').click();
                $('#game_start').click()
            });
            $('#share').on('click', function() {
                VK.api('friends.get', {
                    fields: 'first_name',
                    order: 'random',
                    count: 1
                }, function(data_f) {
                    console.log(data_f.response[0]);
                    VK.api('wall.post', {
                        owner_id: data_f.response[0].user_id,
                        message: 'Пора спасать Ёлочки ' + data_f.response[0].first_name + '\nhttps://vk.com/app5144297',
                        attachment: "photo-107246498_393534100"
                    })
                })
            })
        });
    </script>
    <script type="text/javascript" src="/js/logics2.js"></script>
</head>
<body>
    <div class='wrapper'>
        <div class='fon'>
            <div class='left_content'>
                <div id="avatar"><img/>
                    <button class='button_info_user_vk' id='first_name'></button>
                    <button class='button_info_user_vk' id='last_name'></button>
                </div>
                <div id='hint'> 
                 <button>Подсказки (3)</button>
                </div>
                <div id='lvl'>
                    <button></button>
                </div>
                <div id='stolb'>
                    <div></div>
                </div>
            </div>
            <div class='center_content'>
                <div class='elka'>
                    <div class='word'></div>
                </div>
            </div>
            <div class='right_content'>
                <div id='rating'></div>
                <a href="https://vk.com/club107246498" target="_blank">
                    <div id='group_app'></div>
                </a>
                <div id='share'></div>
                <div id='snegovik' style='width:150px;height:230px; margin-top:70px; margin-left:15px'><img style='width:100%;height:100%' /></div>
            </div>
        </div>
    </div>
</body>
</html>
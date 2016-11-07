<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="/css/VK/Animals/app.min.css" />
    <script type="text/javascript" src="/js/jquery-2.0.0.min.js"></script>
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <script src="//vk.com/js/api/xd_connection.js?2" type="text/javascript"></script>
    <script src="/js/VK/Animals/app.min.js"></script>
    <meta charset="utf-8"/>
</head>
<body>
<div id="main">
    <div class="menu">
        <div class="avatar_user">
        </div>
        <div style="width:108px;float: left; height:100%;border-right: 1px dashed #fff;">
            <button class="info_user name"></button>
            <button class="info_user last_name"></button>
        </div>
        <div class="lvl">{{$data['level']}}</div>
        <div class="count_animals">{{$data['count_animals']}}</div>
        <button id="add_friends" class="sprite_add_friends"></button>
    </div>
    <div class="container"><!--
            <div class='map'>
       </div>
        <div class='right_menu'>
            <div class="back_arcade_game"><button>Главное Меню</button></div>
            <div class="avatar_zv" id="avatar_zv_leo">
                <div class="info_zv">
                    <div class="top">ЛЕВ</div>
                </div>
            </div>
            <div class="avatar_zv" id="avatar_zv_tiger">
                <div class="info_zv">
                    <div class="top">Тигр</div>
                </div>
            </div>
            <div class="avatar_zv" id="avatar_zv_zebra">
                <div class="info_zv">
                    <div class="top">Зебра</div>
                </div>
            </div>
            <div class="avatar_zv" id="avatar_zv_krokodil">
                <div class="info_zv">
                    <div class="top">Крокодил</div>
                </div>
            </div>
        </div>-->

        <div class="container_game">
            <div class="anim"></div>
            <div class="game_button sprite" id="game_arcade"></div>
            <div class="game_button sprite" id="game_rating"></div>
            <a href="https://vk.com/zveryata_game " target="_blank">
                <div class="game_button sprite" id="game_group"></div>
            </a>
        </div>
    </div>

</div>
</body>
</html>

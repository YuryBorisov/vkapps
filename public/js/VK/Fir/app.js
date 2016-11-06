$(document).ready(function(){

    var vk_id;

    const DIR = '/images/VK/';

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var date = new Date();
    var d = date.getHours();

    if ((d >= 17 || d <= 8)) {
        $('.fon').addClass('fon-night');
        $('#snegovik img').attr("src", DIR + "snegovik_noch.png");
        $('#avatar').addClass('avatar-night');
    } else {
        $('.fon').addClass('fon-day');
        $('#snegovik img').attr("src",  DIR + "snegovik.png");
        $('#avatar').addClass('avatar-day');
    }

    VK.api("users.get", {
        fields: "id,photo_100,first_name,last_name"
    }, function(data) {
        $('#avatar img').attr('src', data.response[0].photo_100);
        $('#first_name').text(data.response[0].first_name);
        $('#last_name').text(data.response[0].last_name);
        vk_id = data.response[0].uid;
        ajaxRequest('/vk/fir/user', 'post', {vk_id: vk_id}, function (data) {
            if(data.status == 'success'){
                if(data.data.user == 'new'){
                    $('.word').html("<div id='info' style='width:480px; height:340px;'></div><div id='bat'></div>");
                } else{
                    $('.word').html("<div id='info' style='width:480px; height:340px;'></div><div id='bat'></div>");
                    $('#info').css('background-image', "url('" + DIR + "comeback.png')");
                }
            }
            $('#stolb div').text(data.data.count_firs);
            if (data.data.count_firs == 0 || data.data.count_firs == 1 || data.data.count_firs == 2){
                data.data.count_firs = 3;
            }
            $('#lvl button').text(parseFloat((data.data.count_firs / 3).toFixed(1)))
        });
    });

    function ajaxRequest(url, type, data, func){
        $.ajax({
            url: url,
            type: type,
            data: data,
            success: function (data) {
                func(data);
            }
        });
    }

    $('#share').on('click', function() {
        VK.api('friends.get', {
            fields: 'first_name',
            order: 'random',
            count: 1
        }, function(data) {
            VK.api('wall.post', {
                owner_id: data.response[0].user_id,
                message: 'Пора спасать Ёлочки ' + data.response[0].first_name + '\nhttps://vk.com/app5144297',
                attachment: "photo-107246498_393534100"
            })
        })
    });

    $(document).on("click", "#bat", function() {
        $('#info').remove();
        $(this).remove();
        $('#game_start').click();
        $('#game_start').click()
    });

    /* Logics */

    var array_map_world = getWordAndElka();

    var color;

    var history;

    var ball_l = 30;

    var array_loc = [];

    var array_loc_figure = [];

    var hint;

    var elka_hint;

    var hint_number = 3;

    function get_elka_hint() {
        $('.word').html(elka_hint);
        DrawAllFigure()
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    function Location(y, x, top, right, bottom, left, image_on, image_off, type_figure, charge) {
        this.y = y;
        this.x = x;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
        this.image_on = image_on;
        this.image_off = image_off;
        this.type_figure = type_figure;
        this.charge = charge;
        this.degrees = 0;
        this.skip_figure = 0
    }

    function getTurn(y, x) {
        if (array_map_world[y][x] != 0) {
            array_map_world[y][x].degrees += 90;
            if (array_map_world[y][x].type_figure == "straight") {
                if (array_map_world[y][x].top == 1 && array_map_world[y][x].bottom == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 1
                } else if (array_map_world[y][x].right == 1 && array_map_world[y][x].left == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 0
                }
            } else if (array_map_world[y][x].type_figure == "star") {
                if (array_map_world[y][x].bottom == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 1
                } else if (array_map_world[y][x].left == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 0
                } else if (array_map_world[y][x].top == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 0
                } else if (array_map_world[y][x].right == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 0
                }
            } else if (array_map_world[y][x].type_figure == "curve_3") {
                if (array_map_world[y][x].top == 1 && array_map_world[y][x].left == 1 && array_map_world[y][x].right == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 0
                } else if (array_map_world[y][x].top == 1 && array_map_world[y][x].right == 1 && array_map_world[y][x].bottom == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 1
                } else if (array_map_world[y][x].left == 1 && array_map_world[y][x].right == 1 && array_map_world[y][x].bottom == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 1
                } else if (array_map_world[y][x].left == 1 && array_map_world[y][x].top == 1 && array_map_world[y][x].bottom == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 1
                }
            } else if (array_map_world[y][x].type_figure == "ball") {
                if (array_map_world[y][x].top == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 0
                } else if (array_map_world[y][x].right == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 0
                } else if (array_map_world[y][x].bottom == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 1
                } else if (array_map_world[y][x].left == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 0
                }
            } else if (array_map_world[y][x].type_figure == "curve_2") {
                if (array_map_world[y][x].top == 1 && array_map_world[y][x].right == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 0
                } else if (array_map_world[y][x].right == 1 && array_map_world[y][x].bottom == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 1
                } else if (array_map_world[y][x].bottom == 1 && array_map_world[y][x].left == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 1
                } else if (array_map_world[y][x].left == 1 && array_map_world[y][x].top == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 0
                }
            }
        }
    }

    function create_figure(y, x, type_figure) {
        var location;
        if (type_figure == "cross")
            location = new Location(y, x, 1, 1, 1, 1, DIR + "cross_on.png", DIR + "cross_off.png", "cross", false)
        else if (type_figure == "straight")
            location = new Location(y, x, 1, 0, 1, 0, DIR + "straight_on.png", DIR + "straight_off.png", "straight", false)
        else if (type_figure == "curve_3")
            location = new Location(y, x, 1, 1, 0, 1, DIR + "curve_3_on.png", DIR + "curve_3_off.png", "curve_3", false)
        else if (type_figure == "ball") {
            var array_ball_color = ['red', 'blue', 'green', 'yellow'];
            var on, off, color_fun = array_ball_color[getRandomInt(0, array_ball_color.length - 1)];
            while (color_fun == color)
                color_fun = array_ball_color[getRandomInt(0, array_ball_color.length - 1)];
            switch (color_fun) {
                case "red":
                    on = "red_on.png";
                    off = "red_off.png";
                    break;
                case "blue":
                    on = "blue_on.png";
                    off = "blue_off.png";
                    break;
                case "green":
                    on = "green_on.png";
                    off = "green_off.png";
                    break;
                case "yellow":
                    on = "yellow_on.png";
                    off = "yellow_off.png";
                    break
            }
            color = color_fun;
            location = new Location(y, x, 1, 0, 0, 0, DIR + on, DIR + off, "ball", false);
        } else if (type_figure == "curve_2")
            location = new Location(y, x, 1, 1, 0, 0, DIR + "curve_2_on.png", DIR + "curve_2_off.png", "curve_2", false);
        else if (type_figure == "star")
            location = new Location(y, x, 0, 0, 1, 0, DIR + "star_on.png", DIR + "star_off.png", "star", false);
        return location;
    }

    function getWordAndElka() {
        var array_map_world = [];
        for (i = 0; i < 15; i++) {
            array_map_world[i] = [];
            for (j = 0; j < 15; j++) {
                array_map_world[i][j] = 0;
                var loc = "y_" + i + "_x_" + j;
                $('.word').append("<div id='" + loc + "' class='loc'></div>")
            }
        }
        array_map_world[0][7] = 1;
        array_map_world[1][7] = 1;
        array_map_world[2][6] = 1;
        array_map_world[2][7] = 1;
        array_map_world[2][8] = 1;
        array_map_world[3][5] = 1;
        array_map_world[3][6] = 1;
        array_map_world[3][7] = 1;
        array_map_world[3][8] = 1;
        array_map_world[3][9] = 1;
        array_map_world[4][4] = 1;
        array_map_world[4][5] = 1;
        array_map_world[4][6] = 1;
        array_map_world[4][7] = 1;
        array_map_world[4][8] = 1;
        array_map_world[4][9] = 1;
        array_map_world[4][10] = 1;
        array_map_world[5][3] = 1;
        array_map_world[5][4] = 1;
        array_map_world[5][5] = 1;
        array_map_world[5][6] = 1;
        array_map_world[5][7] = 1;
        array_map_world[5][8] = 1;
        array_map_world[5][9] = 1;
        array_map_world[5][10] = 1;
        array_map_world[5][11] = 1;
        array_map_world[6][3] = 1;
        array_map_world[6][4] = 1;
        array_map_world[6][5] = 1;
        array_map_world[6][6] = 1;
        array_map_world[6][7] = 1;
        array_map_world[6][8] = 1;
        array_map_world[6][9] = 1;
        array_map_world[6][10] = 1;
        array_map_world[6][11] = 1;
        array_map_world[7][2] = 1;
        array_map_world[7][3] = 1;
        array_map_world[7][4] = 1;
        array_map_world[7][5] = 1;
        array_map_world[7][6] = 1;
        array_map_world[7][7] = 1;
        array_map_world[7][8] = 1;
        array_map_world[7][9] = 1;
        array_map_world[7][10] = 1;
        array_map_world[7][11] = 1;
        array_map_world[7][12] = 1;
        array_map_world[8][2] = 1;
        array_map_world[8][3] = 1;
        array_map_world[8][4] = 1;
        array_map_world[8][5] = 1;
        array_map_world[8][6] = 1;
        array_map_world[8][7] = 1;
        array_map_world[8][8] = 1;
        array_map_world[8][9] = 1;
        array_map_world[8][10] = 1;
        array_map_world[8][11] = 1;
        array_map_world[8][12] = 1;
        array_map_world[9][1] = 1;
        array_map_world[9][2] = 1;
        array_map_world[9][3] = 1;
        array_map_world[9][4] = 1;
        array_map_world[9][5] = 1;
        array_map_world[9][6] = 1;
        array_map_world[9][7] = 1;
        array_map_world[9][8] = 1;
        array_map_world[9][9] = 1;
        array_map_world[9][10] = 1;
        array_map_world[9][11] = 1;
        array_map_world[9][12] = 1;
        array_map_world[9][13] = 1;
        array_map_world[10][1] = 1;
        array_map_world[10][2] = 1;
        array_map_world[10][3] = 1;
        array_map_world[10][4] = 1;
        array_map_world[10][5] = 1;
        array_map_world[10][6] = 1;
        array_map_world[10][7] = 1;
        array_map_world[10][8] = 1;
        array_map_world[10][9] = 1;
        array_map_world[10][10] = 1;
        array_map_world[10][11] = 1;
        array_map_world[10][12] = 1;
        array_map_world[10][13] = 1;
        array_map_world[11][1] = 1;
        array_map_world[11][2] = 1;
        array_map_world[11][3] = 1;
        array_map_world[11][4] = 1;
        array_map_world[11][5] = 1;
        array_map_world[11][6] = 1;
        array_map_world[11][7] = 1;
        array_map_world[11][8] = 1;
        array_map_world[11][9] = 1;
        array_map_world[11][10] = 1;
        array_map_world[11][11] = 1;
        array_map_world[11][12] = 1;
        array_map_world[11][13] = 1;
        array_map_world[12][0] = 1;
        array_map_world[12][1] = 1;
        array_map_world[12][2] = 1;
        array_map_world[12][3] = 1;
        array_map_world[12][4] = 1;
        array_map_world[12][5] = 1;
        array_map_world[12][6] = 1;
        array_map_world[12][7] = 1;
        array_map_world[12][8] = 1;
        array_map_world[12][9] = 1;
        array_map_world[12][10] = 1;
        array_map_world[12][11] = 1;
        array_map_world[12][12] = 1;
        array_map_world[12][13] = 1;
        array_map_world[12][14] = 1;
        array_map_world[13][0] = 1;
        array_map_world[13][1] = 1;
        array_map_world[13][2] = 1;
        array_map_world[13][3] = 1;
        array_map_world[13][4] = 1;
        array_map_world[13][5] = 1;
        array_map_world[13][6] = 1;
        array_map_world[13][7] = 1;
        array_map_world[13][8] = 1;
        array_map_world[13][9] = 1;
        array_map_world[13][10] = 1;
        array_map_world[13][11] = 1;
        array_map_world[13][12] = 1;
        array_map_world[13][13] = 1;
        array_map_world[13][14] = 1;
        array_map_world[14][7] = 1;
        return array_map_world
    }

    function getH(y, x) {
        if (array_map_world[14][7].top == 1 && array_map_world[13][7].bottom == 1) {
            if (y == 13 && x == 7) {
                array_map_world[13][7].charge = true;
                array_map_world[y][x - 1].skip = 1;
                $('#y_' + 13 + "_x_" + 7).css("background-image", "url(" + array_map_world[13][7].image_on + ")")
            }
            if (array_map_world[y][x].type_figure != "ball") {
                if (x != 0 && array_map_world[y][x].charge == true && array_map_world[y][x].left == 1 && array_map_world[y][x - 1].skip_figure == 0 && array_map_world[y][x - 1].right == 1) {
                    array_map_world[y][x - 1].charge = true;
                    array_map_world[y][x - 1].skip_figure = 1;
                    var x_2 = x - 1;
                    $('#y_' + y + "_x_" + x_2).css("background-image", "url(" + array_map_world[y][x_2].image_on + ")");
                    getH(y, x_2)
                }
                if (y != 0 && array_map_world[y][x].charge == true && array_map_world[y][x].top == 1 && array_map_world[y - 1][x].bottom == 1 && array_map_world[y - 1][x].skip_figure == 0) {
                    array_map_world[y - 1][x].charge = true;
                    array_map_world[y - 1][x].skip_figure = 1;
                    var y_2 = y - 1;
                    $('#y_' + y_2 + "_x_" + x).css("background-image", "url(" + array_map_world[y_2][x].image_on + ")");
                    getH(y_2, x)
                }
                if (x != 14 && array_map_world[y][x].charge == true && array_map_world[y][x].right == 1 && array_map_world[y][x + 1].left == 1 && array_map_world[y][x + 1].skip_figure == 0) {
                    array_map_world[y][x + 1].charge = true;
                    array_map_world[y][x + 1].skip_figure = 1;
                    var x_2 = x + 1;
                    $('#y_' + y + "_x_" + x_2).css("background-image", "url(" + array_map_world[y][x_2].image_on + ")");
                    getH(y, x_2)
                }
                if (y != 13 && array_map_world[y][x].charge == true && array_map_world[y][x].bottom == 1 && array_map_world[y + 1][x].top == 1 && array_map_world[y + 1][x].skip_figure == 0) {
                    array_map_world[y + 1][x].charge = true;
                    array_map_world[y + 1][x].skip_figure = 1;
                    var y_2 = y + 1;
                    $('#y_' + y_2 + "_x_" + x).css("background-image", "url(" + array_map_world[y_2][x].image_on + ")");
                    getH(y_2, x)
                }
            }
        } else {
            for (var i = 0; i < array_map_world.length; i++) {
                for (var j = 0; j < array_map_world[i].length; j++) {
                    if (array_map_world[i][j] != 0) {
                        $('#y_' + i + "_x_" + j).css("background-image", "url(" + array_map_world[i][j].image_off + ")");
                        array_map_world[i][j].charge = false
                    }
                }
            }
            for (var i = 0; i < array_map_world.length; i++) {
                for (var j = 0; j < array_map_world[i].length; j++) {
                    if (array_map_world[i][j] != 0) {
                        array_map_world[i][j].skip_figure = 0;
                        array_map_world[i][j].charge = false
                    }
                }
            }
            array_map_world[14][7].charge = true
        }
    }

    function DrawAllFigure() {
        for (var i = 0; i < array_map_world.length; i++) {
            for (var j = 0; j < array_map_world[i].length; j++) {
                if (array_map_world[i][j] != 0) {
                    if (array_map_world[i][j].charge == true) {
                        $('#y_' + i + "_x_" + j).css("background-image", "url(" + array_map_world[i][j].image_on + ")").css('cursor', 'pointer')
                    } else {
                        $('#y_' + i + "_x_" + j).css("background-image", "url(" + array_map_world[i][j].image_off + ")").css('cursor', 'pointer')
                    }
                    $('#y_' + array_map_world[i][j].y + "_x_" + array_map_world[i][j].x).rotate(array_map_world[i][j].degrees)
                } else {}
            }
        }
    }

    function isCharge() {
        var flag = true;
        SkipDefault();
        getH(13, 7);
        for (var i = 0; i < array_map_world.length; i++) {
            for (var j = 0; j < array_map_world[i].length; j++) {
                if (array_map_world[i][j] != 0) {
                    if (array_map_world[i][j].charge == false) {
                        flag = false;
                        break
                    }
                }
            }
        }
        return flag
    }

    function SkipDefault() {
        for (var i = 0; i < array_map_world.length; i++) {
            for (var j = 0; j < array_map_world[i].length; j++) {
                if (array_map_world[i][j] != 0) {
                    array_map_world[i][j].skip_figure = 0;
                    array_map_world[i][j].charge = false
                }
            }
        }
        array_map_world[14][7].charge = true
    }

    function setBall(y, x) {
        var flag = true;
        array_map_world[y][x] = create_figure(y, x, 'ball');
        if (isCharge() == false) {
            flag = false;
            for (var i = 0; i < 3; i++) {
                getTurn(y, x);
                if (isCharge()) {
                    flag = true;
                    i = 3
                }
            }
        }
        return flag
    }

    function setFigure() {
        var array_ficure = ['curve_2', 'straight', 'curve_3', 'cross'];
        for (var i = 2; i <= array_map_world.length - 2; i++) {
            for (var j = 0; j < array_map_world[i].length; j++) {
                if (array_map_world[i][j] != 0 && array_map_world[i][j].type_figure != "ball") {
                    var flag = true;
                    while (flag) {
                        for (var f = 0; f < array_ficure.length; f++) {
                            array_map_world[i][j] = create_figure(i, j, array_ficure[f]);
                            if (isCharge()) {
                                flag = false;
                                f = 5;
                                break
                            } else {
                                for (var h = 0; h <= 3; h++) {
                                    getTurn(i, j);
                                    if (isCharge()) {
                                        flag = false;
                                        f = 5;
                                        break
                                    }
                                }
                            }
                        }
                        flag = false
                    }
                }
            }
        }
    }

    function getWord() {
        var y = 0;
        var array_loc = [];
        hint_number = 3;
        $('#hint button').text("Подсказки (" + hint_number + ")");
        $('#hint button').css('cursor', 'pointer');
        for (var i = 2; i <= array_map_world.length - 2; i++) {
            for (var j = 0; j < array_map_world[i].length; j++) {
                if (array_map_world[i][j] != 0) {
                    array_map_world[i][j] = create_figure(i, j, 'cross');
                    if ((i != 13 && j != 7) || (i != 1 && j != 7) || (i != 2 && j != 7)) {
                        array_loc[y++] = i + '/' + j
                    }
                }
            }
        }
        array_map_world[0][7] = create_figure(0, 7, "star");
        array_map_world[1][7] = create_figure(1, 7, 'straight');
        array_map_world[14][7] = create_figure(14, 7, 'straight');
        array_map_world[14][7].charge = true;
        while (ball_l != 0) {
            var random_ball = getRandomInt(0, array_loc.length - 1);
            var arr = array_loc[random_ball].split('/');
            if (setBall(arr[0], arr[1])) {
                array_loc.splice(random_ball - 1, 1);
                ball_l--
            } else {
                array_map_world[arr[0]][arr[1]] = create_figure(arr[0], arr[1], 'cross');
                array_loc.splice(random_ball, 1);
                ball_l++
            }
        }
        setFigure();
        getH(13, 7);
        DrawAllFigure();
        for (var i = 2; i <= array_map_world.length - 2; i++) {
            for (var j = 0; j < array_map_world[i].length; j++) {
                if (array_map_world[i][j] != 0) {
                    if (array_map_world[i][j] != 0 && array_map_world[i][j].type_figure == "curve_2") {
                        if (array_map_world[i][j].top == 1 && array_map_world[i][j].right == 1 && array_map_world[i - 1][j] == 0) {
                            var loc = array_map_world[i][j];
                            array_map_world[i][j] = create_figure(i, j, 'ball');
                            getTurn(i, j);
                            if (isCharge() == false) {
                                array_map_world[i][j] = loc
                            }
                        }
                        if (array_map_world[i][j].top == 1 && array_map_world[i][j].right == 1 && array_map_world[i - 1][j].bottom == 0) {
                            var loc = array_map_world[i][j];
                            array_map_world[i][j] = create_figure(i, j, 'ball');
                            getTurn(i, j);
                            if (isCharge() == false) {
                                array_map_world[i][j] = loc
                            }
                        }
                    }
                }
            }
        }
        DrawAllFigure();
        hint = $('.word').html();
        for (var i = 2; i <= array_map_world.length - 2; i++) {
         for (var j = 0; j < array_map_world[i].length; j++) {
         if (array_map_world[i][j] != 0) {
         var k = getRandomInt(0, 3);
         for (var v = 0; v < k; v++) {
         getTurn(i, j)
         }
         }
         }
        }
        SkipDefault();
        getH(13, 7);
        DrawAllFigure();
        $('.loc').css('display', 'block')
    }

    $(document).on("click", "#bat", function() {
        $('.elka').css("background-image", "url('" + DIR + "pine1_1.png')");
        $('.word').html('');
        getWordAndElka();
        ball_l = 30;
        $('#hint').css('display', 'block');
        getWord()
    });

    $(document).on("mousedown", ".loc", function() {
        var id = $(this).attr('id');
        var location = id.split("_");
        var y = location[1];
        var x = location[3];
        if (array_map_world[y][x] != 0) {
            array_map_world[y][x].degrees += 90;
            if (array_map_world[y][x].type_figure == "straight") {
                if (array_map_world[y][x].top == 1 && array_map_world[y][x].bottom == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 1
                } else if (array_map_world[y][x].right == 1 && array_map_world[y][x].left == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 0
                }
            } else if (array_map_world[y][x].type_figure == "star") {
                if (array_map_world[y][x].bottom == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 1
                } else if (array_map_world[y][x].left == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 0
                } else if (array_map_world[y][x].top == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 0
                } else if (array_map_world[y][x].right == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 0
                }
            } else if (array_map_world[y][x].type_figure == "curve_3") {
                if (array_map_world[y][x].top == 1 && array_map_world[y][x].left == 1 && array_map_world[y][x].right == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 0
                } else if (array_map_world[y][x].top == 1 && array_map_world[y][x].right == 1 && array_map_world[y][x].bottom == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 1
                } else if (array_map_world[y][x].left == 1 && array_map_world[y][x].right == 1 && array_map_world[y][x].bottom == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 1
                } else if (array_map_world[y][x].left == 1 && array_map_world[y][x].top == 1 && array_map_world[y][x].bottom == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 1
                }
            } else if (array_map_world[y][x].type_figure == "ball") {
                if (array_map_world[y][x].top == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 0
                } else if (array_map_world[y][x].right == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 0
                } else if (array_map_world[y][x].bottom == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 1
                } else if (array_map_world[y][x].left == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 0
                }
            } else if (array_map_world[y][x].type_figure == "curve_2") {
                if (array_map_world[y][x].top == 1 && array_map_world[y][x].right == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 0
                } else if (array_map_world[y][x].right == 1 && array_map_world[y][x].bottom == 1) {
                    array_map_world[y][x].top = 0;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 1;
                    array_map_world[y][x].left = 1
                } else if (array_map_world[y][x].bottom == 1 && array_map_world[y][x].left == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 0;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 1
                } else if (array_map_world[y][x].left == 1 && array_map_world[y][x].top == 1) {
                    array_map_world[y][x].top = 1;
                    array_map_world[y][x].right = 1;
                    array_map_world[y][x].bottom = 0;
                    array_map_world[y][x].left = 0
                }
            }
            for (var i = 0; i < array_map_world.length; i++) {
                for (var j = 0; j < array_map_world[i].length; j++) {
                    if (array_map_world[i][j] != 0 || array_map_world[i][j] == 1) {
                        $('#y_' + i + "_x_" + j).css("background-image", "url(" + array_map_world[i][j].image_off + ")").css('cursor', 'pointer');
                        array_map_world[i][j].skip_figure = 0;
                        array_map_world[i][j].charge = false
                    }
                }
            }
            $('#y_' + 14 + "_x_" + 7).css("background-image", "url(" + array_map_world[14][7].image_on + ")");
            array_map_world[14][7].charge = true;
            getH(13, 7);
            var flag = true;
            for (var i = 0; i < array_map_world.length; i++) {
                for (var j = 0; j < array_map_world[i].length; j++) {
                    if (array_map_world[i][j] != 0 && array_map_world[i][j].type_figure == 'ball' || array_map_world[i][j] != 0 && array_map_world[i][j].type_figure == "star") {
                        if (array_map_world[i][j].charge == false) {
                            flag = false;
                            break
                        }
                    }
                }
            }
            if (flag) {
                VK.api("users.get", {
                    fields: "sex"
                }, function(data) {
                    ajaxRequest('/vk/fir/add', 'post', {vk_id: data.response[0].uid}, function (dataR) {
                        if(dataR.status == 'success'){
                            var result = dataR.data.count_firs;
                            if (result == 0 || result == 1 || result == 2) {
                                result = 3
                            }
                            var ttt = parseFloat((parseFloat(result / 3)).toFixed(1));
                            $('#stolb div').text(dataR.data.count_firs);
                            $('#lvl button').text(ttt);
                            if (Number.isInteger(ttt)) {
                                var g;
                                if (data.response[0].sex == 1) {
                                    g = "достигла " + ttt
                                } else {
                                    g = "достиг " + ttt
                                }
                                VK.api('wall.post', {
                                    message: 'Я ' + g + ' уровня в игре "Ёлочка, гори" https://vk.com/app5144297',
                                    attachment: "photo-107246498_393534100"
                                })
                            } else {
                                var g = "собрал";
                                if (data.response[0].sex == 1) {
                                    g = "собрала"
                                }
                                if (dataR.data.count_firs == 1) {
                                    VK.api('wall.post', {
                                        message: 'Я ' + g + ' свою первую Ёлочку в приложении "Ёлочка, гори", что бы спасти Новый Год https://vk.com/app5144297',
                                        attachment: "photo-107246498_393534100"
                                    })
                                } else {
                                    VK.api('wall.post', {
                                        message: 'Я ' + g + ' свою ' + dataR.data.count_firs + '-ую Ёлочку в приложении "Ёлочка, гори", что бы спасти Новый Год https://vk.com/app5144297',
                                        attachment: "photo-107246498_393534100"
                                    })
                                }
                            }
                        }else{
                            alert(data.message);
                        }
                    });
                });
                $('.word').html("<div id='info_flag' style='width:480px; height:340px;'></div><div id='bat'></div>")
            }
            $('#y_' + 14 + "_x_" + 7).css("background-image", "url(" + array_map_world[14][7].image_on + ")");
            $('#y_' + array_map_world[y][x].y + "_x_" + array_map_world[y][x].x).rotate({
                animateTo: array_map_world[y][x].degrees
            })
        }
    });

    $(document).on("click", "#game_start", function() {
        $(this).remove();
        getWord()
    });

    $(document).on("click", "#rating", function() {
        history = $('.word').html();
        $(this).css("background-image", "url('" + DIR + "play1.png')");
        $(this).attr('id', 'rating_game');
        var html = "<div id='panel_rating' style='width:100%;height:37px;'><div id='rating_today'></div><div id='rating_all'></div><div id='rating_friends'></div></div><div id='rating_content'></div>";
        $('.word').html(html);
        $('.elka').css("background", "transparent");
        $('.loc').css('display', 'none');
        $('#hint').css('display', 'none');
        $('#rating_today').click()
    });

    $(document).on("click", "#rating_game", function() {
        $('#panel_rating').remove();
        $('#rating_content').remove();
        $(this).attr('id', 'rating');
        $(this).css("background-image", "url('" + DIR + "reyting.png')");
        $('.elka').css("background-image", "url('" + DIR + "pine1_1.png')");
        $('.word').html(history);
        getH(13, 7);
        $('.loc').css('display', 'block');
        DrawAllFigure();
        $('#hint').css('display', 'block')
    });

    $(document).on("click", "#invite", function() {
        VK.callMethod("showInviteBox");
    });

    $(document).on("click", "#hint", function() {
        if (hint_number >= 1) {
            elka_hint = $('.word').html();
            $('.word').html(hint);
            setTimeout(get_elka_hint, 1200);
            $('#hint button').text("Подсказки (" + --hint_number + ")")
        } else {
            $('#hint button').css('cursor', 'default')
        }
        if (hint_number == 0) {
            $('#hint button').css('cursor', 'default')
        }
    });

    /*Рейтинг*/
    
    function getRating(dataRating) {
        ajaxRequest('/vk/fir/rating', 'post', dataRating, function (data) {
            if(data.status == 'success'){
                var g = '';
                var count = data.data.users.length;
                if(count == 0){
                    g = "<div class='rating_not'>Рейтинг пуст :(</div>" +
                        "<div id='invite' style='float:left; margin-top:10px; margin-left:130px;'></div>";
                    $('#rating_content').html(g);
                }else{
                    var type = dataRating.type;
                    var html = '';
                    var vk_ids = [];
                    var n = (parseInt(data.data.page) - 1) * 7 + 1;
                    for(var i = 0; i < count; i++){
                        html += "<div class = 'tablo'><div id='tablo_number'><button>" + (i + n) + "</button></div><div id='tablo_avatar' ><a href='https://vk.com/id" + data.data.users[i].vk_id + "' target='_blank'><img class='table_avatar_" + data.data.users[i].vk_id + "' style='width:100%;height:100%' src='/images/VK/load_avatar.gif'/></a></div><div id='tablo_first_name_and_last_name'><div id='tablo_first_name'><button class='table_first_name_" + data.data.users[i].vk_id + "'></button></div><div id='tablo_first_name'><button class='table_last_name_" + data.data.users[i].vk_id + "'></button></div></div><div id='tablo_coutn'>" + data.data.users[i].count_firs + "</div></div>";
                        vk_ids.push(data.data.users[i].vk_id);
                    }
                    $('#rating_content').html(html);
                    VK.api("users.get", {uids: vk_ids, fields: "id,photo_50,first_name,last_name"}, function(vk) {
                        for (var i = 0, l = vk.response.length; i < l; i++) {
                            $('.table_avatar_' + vk.response[i].uid).attr("src", vk.response[i].photo_50);
                            $('.table_first_name_' + vk.response[i].uid).text(vk.response[i].first_name);
                            $('.table_last_name_' + vk.response[i].uid).text(vk.response[i].last_name)
                        }
                    });
                    if(data.data.next){
                        g = data.data.page == 1
                            ?
                        "<div class='rating_button' id='invite'></div><div style='margin-left: 20px' type='"+type+"' page='"+(parseInt(data.data.page) + 1)+"' class='rating_button_next rating_button'></div>"
                            :
                        "<div class='rating_button rating_button_prev' type='"+type+"' page='"+(parseInt(data.data.page) - 1)+"' id='prev_rating'></div><div style='margin-left: 20px' type='"+type+"' page='"+(parseInt(data.data.page) + 1)+"' class='rating_button_next rating_button'></div>";
                    }else{
                        g = data.data.page == 1
                            ?
                            "<div class='rating_button' id='invite'></div>"
                            :
                        "<div class='rating_button rating_button_prev' type='"+type+"' page='"+(parseInt(data.data.page) - 1)+"'></div><div class='rating_button' style='margin-left: 20px' id='invite'></div>";
                    }
                    $('#rating_content').append(g);
                }
            }else{
                alert(data.message);
            }
        });
    }

    $(document).on('click', '.rating_button_next', function(){
        getRating({type: $(this).attr('type'), page: $(this).attr('page')});
    });

    $(document).on('click', '.rating_button_prev', function(){
        getRating({type: $(this).attr('type'), page: $(this).attr('page')});
    });

    function rating(dataRating){
        switch (dataRating.type){
            case 'today':
                $("#rating_today").removeClass('rating_today_off').addClass('rating_today_on');
                $("#rating_friends").removeClass('rating_friends_on').addClass('rating_friends_off');
                $('#rating_all').removeClass('rating_all_on').addClass('rating_all_off');
                break;
            case 'all':
                $('#rating_all').removeClass('rating_all_off').addClass('rating_all_on');
                $("#rating_today").removeClass('rating_today_on').addClass('rating_today_off');
                $("#rating_friends").removeClass('rating_friends_on').addClass('rating_friends_off');
                break;
            case 'friends':
                $("#rating_friends").removeClass('rating_friends_off').addClass('rating_friends_on');
                $('#rating_all').removeClass('rating_all_on').addClass('rating_all_off');
                $("#rating_today").removeClass('rating_today_on').addClass('rating_today_off');
        }
        getRating(dataRating);
    }

    $(document).on("click", "#rating_today", function() {
        rating({type: 'today', page: 1});
    });

    $(document).on("click", "#rating_all", function() {
        rating({type: 'all', page: 1});
    });

    $(document).on("click", "#rating_friends", function() {
        VK.api("friends.getAppUsers", {}, function(data) {
            console.log(data);
            rating({type: 'friends', page: 1, vk_ids: data});
        })
    });

});
$(document).ready(function(){

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    const mainMapLoc = 'loc';

    var x = 13, y = 25, mainMap = '.map', loc_exit = '/images/VK/Animals/loc_exit.jpg',
        classGrass = 'grass', classExit = 'exit',
        arrayLocation = [], arrayAnimals = [], arrayONLocation = [], loc = '', countAnimals = 0,
        levelUser = 1, countAnimalsUser = 0, statusGame = false, countTypeAnimals = 0, ratingCount = 0, arrFriends;

    const N = x * y;

    var vk_id = 333114129;

    var arrayTypeAnimals = [];

    VK.api("friends.getAppUsers", {}, function(data) {
        arrFriends = data.response.join();
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

    VK.api('users.get', {fields: 'id,photo_50,first_name,last_name' }, function (data) {
        vk_id = data.response[0].uid;
        $('.avatar_user').css('background-image', "url(" + data.response[0].photo_50 + ")");
        $('.name').text(data.response[0].first_name);
        $('.last_name').text(data.response[0].last_name);
        $.ajax({
            url: '/vk/animals/is',
            type: 'post',
            data: {vk_id: vk_id},
            success: function(data){
                data = $.parseJSON(data);
                $('.lvl').text(levelUser = data.level);
                $('.count_animals').text(countAnimalsUser = data.count_animals);
            }
        });
    });

    $.ajax({
        url:'/vk/animals/animals',
        type:'post',
        success: function(data){
            data = $.parseJSON(data);
            for(var i = 0, j = data.length; i < j; i++){
                arrayTypeAnimals.push({
                    type: data[i].type,
                    name: data[i].name,
                    path_map: data[i].path_map,
                    path_avatar: data[i].path_avatar,
                    step: data[i].step,
                    avatar_zv : data[i].avatar_zv
                });
            }
            countTypeAnimals = arrayTypeAnimals.length;
        }
    });

    function R(status){
        var urlImg = status == 1 ? 'win_img': 'game_over_img';
        var textLevel = status == 1 ? 'Следующий уровень' : 'Переиграть';
        $('.map').append('<div class="panel_user_game">' +
            '<div class="img" id="' +urlImg+ '"></div>' +
            '<div class="main_menu">Главное меню</div>' +
            '<div class="level" id="restart_game">' + textLevel + '</div>' +
            '</div>');
        locFunc(0.5, 0, false);
    }

    function locFunc(opacity, cursor, status){
        $('.loc').css({
            'opacity': opacity,
            'cursor': cursor == 1 ? 'pointer' : 'default'
        });
        statusGame = status;
    }

    function createA(status){
        $(mainMap).attr('status', status);
        for(var i = 0; i <= x; i++){
            arrayLocation[i] = [];
            for(var j = 0; j <= y; j++){
                loc = "<div class=" + mainMapLoc + " id=" + mainMapLoc + "_x_" + i + "_y_" + j + " x=" + i + " y=" + j + "></div>";
                $(mainMap).append(loc);
                arrayLocation[i][j] = new Location(i, j);
                $('#' + mainMapLoc + '_x_' + i + '_y_' + j).addClass(classGrass);
            }
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getLocationStatus(x, y){
        return arrayLocation[x][y].status;
    }

    function setLocationStatusTrue(x, y){
        arrayLocation[x][y].status = true;
        redrawingLocation();
    }

    function setLocationStatusTrueAnimal(x, y, animalTypeID){
        arrayLocation[x][y].status = true;
        arrayLocation[x][y].animal = true;
        redrawingLocation();
        $('#' + mainMapLoc + '_x_' + x + '_y_' + y).removeClass().addClass('loc ' + arrayTypeAnimals[animalTypeID].type);
    }

    function getLocationAnimal(x, y){
        return arrayLocation[x][y].animal
    }

    function getLocationAnimals(x, y){
        return arrayLocation[x][y].animals;
    }

    function redrawingLocation(){
        for(var i = 0; i <= x; i++){
            for(var j = 0; j <= y; j++){
                if(getLocationStatus(i, j) && !getLocationAnimals(i , j)){
                    //$('#' + mainMapLoc + '_x_' + i + '_y_' + j).text(i + '/' + j);
                    var x_top = (j % 2 == 0) ? i - 1 : i;
                    var y_top = j + 1;
                    var x_left = (j % 2 == 0) ? i - 1 : i;
                    var y_left = j - 1;
                    var elem = $('#' + mainMapLoc + '_x_' + i + '_y_' + j);
                    if(x_top >= 0 && y_top <= y && x_left >= 0 && y_left >= 0 && !getLocationAnimal(i, j) && getLocationStatus(x_top, y_top) && getLocationStatus(x_left, y_left)){
                        //$('#' + mainMapLoc + '_x_' + i + '_y_' + j).removeClass().addClass('loc water');
                        elem.removeClass();
                        elem.addClass('loc water');
                    }else if(x_top >= 0 && y_top <= y && !getLocationAnimal(i, j) && getLocationStatus(x_top, y_top)){
                        //$('#' + mainMapLoc + '_x_' + i + '_y_' + j).removeClass().addClass('loc water_1');
                        elem.removeClass();
                        elem.addClass('loc water_1');
                    }else if(x_left >= 0 && y_left >= 0 && !getLocationAnimal(i, j) && getLocationStatus(x_left, y_left)){
                        // $('#' + mainMapLoc + '_x_' + i + '_y_' + j).removeClass().addClass('loc water_2');
                        elem.removeClass();
                        elem.addClass('loc water_2');
                    }//else if(x_left >= 0 && y_left <= y - 1 && getLocationStatus(x_left, y_left)){
                    //  $('#' + mainMapLoc + '_x_' + i + '_y_' + j).removeClass().addClass('loc water');
                    //}
                    else{
                        if(getLocationAnimal(i, j))
                            continue;
                        //$('#' + mainMapLoc + '_x_' + i + '_y_' + j).removeClass().addClass('loc stop');
                        elem.removeClass();
                        elem.addClass('loc stop');
                    }

                }
            }
        }
    }

    function setLocationColorExit(x, y){
        $('#' + mainMapLoc + '_x_' + x + '_y_' + y).removeClass().addClass('loc ' + classExit);
    }

    function Location(x, y){
        this.x = x;
        this.y = y;
        this.status = false;
        this.p = 0;
        this.animal = false;
    }

    function getRandomIDTypeAnimal(){
        return getRandomInt(0, arrayTypeAnimals.length - 1);
    }

    function Animals(type, x, y){
        this.type = type;
        this.status = false;
        this.x = x;
        this.y = y;
    }

    function setLocationAnimals(random){
        var xT = parseInt(x / 2);
        var yT = parseInt(y / 2);
        var x1 = parseInt(xT);
        var x2 = parseInt(xT + 2);
        var y1 = parseInt(yT - 2);
        var y2 = parseInt(yT + 2);
        for(var animal = 0; animal < countAnimals; animal++){
            Main: for(var i = x1; i < x2; i++){
                for(var j = y1; j < y2; j++){
                    if(!getLocationStatus(i, j)){
                        var id = getRandomIDTypeAnimal();
                        arrayAnimals[animal] = new Animals(id, i, j);
                        setLocationStatusTrueAnimal(i, j, id);
                        break Main;
                    }

                }
            }
        }

        for(var i = 0; i <= x; i++){
            arrayONLocation.push({
                x: i,
                y: 0
            });
            setLocationColorExit(i, 0);
        }

        for(var i = 1; i <= y; i++){
            if((i % 2) != 0){
                arrayONLocation.push({
                    x: x,
                    y: i
                });
                setLocationColorExit(x, i);
            }
        }

        for(var i = 2; i <= y; i++){
            if((i % 2) == 0){
                arrayONLocation.push({
                    x: 0,
                    y: i
                });
                setLocationColorExit(0, i);
            }
        }

        for(var i = 0; i <= x - 1; i++){
            arrayONLocation.push({
                x: i,
                y: y
            });
            setLocationColorExit(i, y);
        }
        for(var i = 0; i < random; i++){
            var x_loc = getRandomInt(0, x);
            var y_loc = getRandomInt(0, y);
            if(!getLocationStatus(x_loc, y_loc)){
                setLocationStatusTrue(x_loc, y_loc);
                for(var j = 0; j < arrayONLocation.length; j++){
                    if(arrayONLocation[j].x == x_loc && arrayONLocation[j].y == y_loc){
                        arrayONLocation.splice(j, 1);
                        break;
                    }
                }
            }else{
                i--;
            }
        }
        redrawingLocation();
        statusGame = true;
    }

    function removeP(){
        for(var i = 0, m = arrayLocation.length; i < m; i++){
            var g = arrayLocation[i].length;
            for(var j = 0; j < g; j++){
                if(!getLocationStatus(i, j)){
                    arrayLocation[i][j].p = 0;
                    $('#' + mainMapLoc + '_x_' + i + '_y_' + j).text('');
                }else{
                    $('#' + mainMapLoc + '_x_' + i + '_y_' + j).text('');
                }
            }

        }
    }

    function deleteONLocation(x, y){
        for(var i = 0, l = arrayONLocation.length; i < l; i++){
            if(arrayONLocation[i].x == x && arrayONLocation[i].y == y){
                arrayONLocation.splice(i, 1);
                setLocationStatusTrue(x, y);
                break;
            }
        }
    }

    function createLocationLocAnimals(animal){
        if(arrayONLocation.length == 0)
            return false;
        else{
            var i = getRandomInt(0, arrayONLocation.length - 1);
            arrayAnimals[animal].endX = arrayONLocation[i].x;
            arrayAnimals[animal].endY = arrayONLocation[i].y;
            var v = li(animal);
            if(v.status){
                arrayAnimals[animal].endLocation = true;
                $('#' + mainMapLoc + '_x_' + arrayAnimals[animal].endX + '_y_' + arrayAnimals[animal].endY).removeClass().
                addClass('loc exit_exit');
                return { status: true, location: v.location };
            }else{
                console.log('create Удалили выход из массива ' + arrayONLocation[i].x + ' : ' + arrayONLocation[i].y);
                deleteONLocation(arrayONLocation[i].x, arrayONLocation[i].y, animal);
                createLocationLocAnimals(animal);
            }
        }
    }

    function li(animal){
        var arrLI = [];
        var onLocationLength = arrayONLocation.length;
        var arrCoordinates = null;
        var flag = true;
        M: for(var i = 0; i <= N; i++){
            if(i == 0){
                if(onLocationLength == 0){
                    flag = false;
                    return {
                        status: 'ok',
                        array: arrLI
                    };
                }
                arrLI[i] = [];
                arrCoordinates = getCoordinates(arrayAnimals[animal].x, arrayAnimals[animal].y);
                liLocation(arrCoordinates['x_top'], arrCoordinates['y_top'],
                    arrCoordinates['x_bottom'], arrCoordinates['y_bottom'],
                    arrCoordinates['x_left'], arrCoordinates['y_left'],
                    arrCoordinates['x_right'], arrCoordinates['y_right'],
                    arrLI, i);
                for(var k = 0; k < onLocationLength; k++) {
                    if (arrCoordinates['x_top'] == arrayONLocation[k].x
                        && arrCoordinates['y_top'] == arrayONLocation[k].y
                        ||
                        arrCoordinates['x_bottom'] == arrayONLocation[k].x &&
                        arrCoordinates['y_bottom'] == arrayONLocation[k].y
                        ||
                        arrCoordinates['x_left'] == arrayONLocation[k].x &&
                        arrCoordinates['y_left'] == arrayONLocation[k].y
                        ||
                        arrCoordinates['x_right'] == arrayONLocation[k].x &&
                        arrCoordinates['y_right'] == arrayONLocation[k].y
                    ) {
                        break M;
                    }
                }
            }
            if(arrLI[i] != undefined){
                for(var j = 0; j < arrLI[i].length; j++){
                    arrCoordinates = getCoordinates(arrLI[i][j].x, arrLI[i][j].y);
                    liLocation(arrCoordinates['x_top'], arrCoordinates['y_top'],
                        arrCoordinates['x_bottom'], arrCoordinates['y_bottom'],
                        arrCoordinates['x_left'], arrCoordinates['y_left'],
                        arrCoordinates['x_right'], arrCoordinates['y_right'],
                        arrLI, arrLI[i][j].number, arrayAnimals[animal].endX, arrayAnimals[animal].endY);
                    for(var k = 0; k < onLocationLength; k++) {
                        if (arrCoordinates['x_top'] == arrayONLocation[k].x
                            && arrCoordinates['y_top'] == arrayONLocation[k].y
                            ||
                            arrCoordinates['x_bottom'] == arrayONLocation[k].x &&
                            arrCoordinates['y_bottom'] == arrayONLocation[k].y
                            ||
                            arrCoordinates['x_left'] == arrayONLocation[k].x &&
                            arrCoordinates['y_left'] == arrayONLocation[k].y
                            ||
                            arrCoordinates['x_right'] == arrayONLocation[k].x &&
                            arrCoordinates['y_right'] == arrayONLocation[k].y
                        ) {

                            return {
                                status: 'ok',
                                array: arrLI
                            };
                        }
                    }
                }
            }else return {
                status: 'not',
                array: arrLI
            };
        }
        return {
            status: 'ok',
            array: arrLI
        };
    }

    function liClose(animal){
        removeP();
        var arrCoordinates = null;
        var onLocationLength = arrayONLocation.length;
        var li2 = li(animal);
        var arrLI = li2.array;
        if(li2.status != 'ok'){
            console.log('Игра ОКОНЧЕНА ок');
            //arrayAnimals[animal].x, arrayAnimals[animal].y
            arrayLocation[arrayAnimals[animal].x][arrayAnimals[animal].y].status = false;
            arrayLocation[arrayAnimals[animal].x][arrayAnimals[animal].y].animal = false;
            redrawingLocation();
            return {
                status: 'win'
            };
        }
        if(arrLI[0].length != 0 && onLocationLength > 0){
            var stepLoc = [];
            var arrLiLength = arrLI.length;
            var indexArrLiLocExit = arrLI[arrLiLength - 2].length - 1;
            var valueArrLiLocExit = arrLI[arrLiLength - 2][indexArrLiLocExit];
            $('#' + mainMapLoc + '_x_' + valueArrLiLocExit.x + '_y_' + valueArrLiLocExit.y).text('yes');
            var c = getCoordinates(arrayAnimals[animal].x, arrayAnimals[animal].y);
            for(var i = 0; i < onLocationLength; i++){
                if(arrayONLocation[i].x == c['x_top'] && arrayONLocation[i].y == c['y_top']
                    ||
                    arrayONLocation[i].x == c['x_right'] && arrayONLocation[i].y == c['y_right']
                    ||
                    arrayONLocation[i].x == c['x_left'] && arrayONLocation[i].y == c['y_left']
                    ||
                    arrayONLocation[i].x == c['x_bottom'] && arrayONLocation[i].y == c['y_bottom']
                ){
                    arrayLocation[arrayAnimals[animal].x][arrayAnimals[animal].y].status = false;
                    arrayLocation[arrayAnimals[animal].x][arrayAnimals[animal].y].animal = false;
                    $('#' + mainMapLoc + '_x_' + arrayAnimals[animal].x + '_y_' + arrayAnimals[animal].y).removeClass().addClass('loc grass');
                    arrayAnimals[animal].x = arrayONLocation[i].x;
                    arrayAnimals[animal].y = arrayONLocation[i].y;
                    setLocationStatusTrueAnimal(arrayAnimals[animal].x, arrayAnimals[animal].y, arrayAnimals[animal].type);
                    return {
                        status: 'caught'
                    };
                }
            }
            for(var i = arrLiLength - 3; i >= 0; i--){
                arrCoordinates = getCoordinates(valueArrLiLocExit.x, valueArrLiLocExit.y);
                for(var j = arrLI[i].length - 1; j >= 0; j--){
                    if(arrLI[i][j].number == valueArrLiLocExit.number - 1 && arrLI[i][j].x == arrCoordinates['x_top'] && arrLI[i][j].y == arrCoordinates['y_top']){
                        //$('#' + mainMapLoc + '_x_' + arrCoordinates['x_top'] + '_y_' + arrCoordinates['y_top']).text(arrLI[i][j].x + '/' + arrLI[i][j].y);
                        stepLoc.push(valueArrLiLocExit = arrLI[i][j]);
                        break;
                    }
                    else if(arrLI[i][j].number == valueArrLiLocExit.number - 1 && arrLI[i][j].x == arrCoordinates['x_bottom'] && arrLI[i][j].y == arrCoordinates['y_bottom']){
                        // $('#' + mainMapLoc + '_x_' + arrCoordinates['x_bottom'] + '_y_' + arrCoordinates['y_bottom']).text(arrLI[i][j].x + '/' + arrLI[i][j].y);
                        stepLoc.push(valueArrLiLocExit = arrLI[i][j]);
                        break;
                    }
                    else if(arrLI[i][j].number == valueArrLiLocExit.number - 1 && arrLI[i][j].x == arrCoordinates['x_left'] && arrLI[i][j].y == arrCoordinates['y_left']){
                        //$('#' + mainMapLoc + '_x_' + arrCoordinates['x_left'] + '_y_' + arrCoordinates['y_left']).text(arrLI[i][j].x + '/' + arrLI[i][j].y);
                        stepLoc.push(valueArrLiLocExit = arrLI[i][j]);
                        break;
                    }
                    else if(arrLI[i][j].number == valueArrLiLocExit.number - 1 && arrLI[i][j].x == arrCoordinates['x_right'] && arrLI[i][j].y == arrCoordinates['y_right']){
                        //$('#' + mainMapLoc + '_x_' + arrCoordinates['x_right'] + '_y_' + arrCoordinates['y_right']).text(arrLI[i][j].x + '/' + arrLI[i][j].y);
                        stepLoc.push(valueArrLiLocExit = arrLI[i][j]);
                        break;
                    }
                }
            }
            arrayLocation[arrayAnimals[animal].x][arrayAnimals[animal].y].status = false;
            arrayLocation[arrayAnimals[animal].x][arrayAnimals[animal].y].animal = false;
            $('#' + mainMapLoc + '_x_' + arrayAnimals[animal].x + '_y_' + arrayAnimals[animal].y).removeClass().addClass('loc grass');
            arrayAnimals[animal].x = stepLoc[stepLoc.length - 1].x;
            arrayAnimals[animal].y = stepLoc[stepLoc.length - 1].y;
            arrayAnimals[animal].locationFinish = stepLoc[0];
            setLocationStatusTrueAnimal(arrayAnimals[animal].x, arrayAnimals[animal].y, arrayAnimals[animal].type);
            return {
                status: 'ok'
            };
        } else console.log('Игра окончена');
    }

    function finishGame(isArcade,  count) {
        $.ajax({
            url: '/vk/animals/inc',
            type: 'post',
            data: {arcade: isArcade, vk_id: vk_id, count_animals: count},
            success: function (data) {
                data = $.parseJSON(data);
                $('.lvl').text(levelUser = data.level);
                $('.count_animals').text(countAnimalsUser = data.count_animals);
                VK.api('wall.post', {
                    message: 'Не дай диким зверям сбежать из зоопарка на волю! https://vk.com/app5420739',
                    attachment: 'photo-116990872_411853868'
                })
            }
        });
    }

    $(document).on('click', '.' + mainMapLoc, function(){
        var x_1 = $(this).attr('x');
        var y_1 = $(this).attr('y');
        if(!getLocationStatus(x_1, y_1) && statusGame){
            setLocationStatusTrue(x_1, y_1);
            for(var animal = 0; animal < arrayAnimals.length; animal++){
                deleteONLocation(x_1, y_1);
                switch ($(mainMap).attr('status')){
                    case 'arcade':
                        switch (liClose(animal).status){
                            case 'ok':
                                console.log('Продолжаем играть');
                                break;
                            case 'win':
                                console.log('Вы поймали Зверя');
                                arrayAnimals.splice(animal, 1);
                                if(arrayAnimals.length == 0) {
                                    console.log('ВЫ ПРОШЛИ УРОВЕНЬ');
                                    R(1);
                                    finishGame(1, countAnimals);
                                }
                                else {
                                    console.log(arrayAnimals);
                                }
                                break;
                            case 'caught':
                                console.log('Зверь выбежал');
                                R(0);
                                console.log('ВЫ ПРОИГРАЛИ');
                                break;
                        }
                        break;
                    case 'rating':
                        switch (liClose(animal).status){
                            case 'win':
                                console.log('Вы поймали Зверя');
                                arrayAnimals.splice(animal, 1);
                                ratingCount++;
                                break;
                            case 'caught':
                                console.log('Зверь выбежал');
                                arrayAnimals.splice(animal, 1);
                                break;
                        }
                        if(arrayAnimals.length == 0){
                            $('.map').append('<div class="panel_user_game">' +
                                '<div class="img_r"></div>' +
                                '<div class="restart_game_rating">Сыграть ещё</div>' +
                                '</div>');
                            $('.panel_user_game').css('margin-top', '142px');
                            locFunc(0.5, 0, false);
                            if(ratingCount > 0)
                                finishGame(0, ratingCount);
                        }
                        break
                }
            }
        }
    });

    function liLocation(x_t, y_t, x_b, y_b, x_l, y_l, x_r, y_r, arrLI, i){
        if(x_t >= 0 && y_t <= y && !getLocationStatus(x_t, y_t) && arrayLocation[x_t][y_t].p == 0){
            arrLI[i + 1] = [];
            arrLI[i].push({x: x_t,y: y_t,number: i + 1});
            arrayLocation[x_t][y_t].p = 1;
        }
        if(x_l >= 0 && y_l >= 0 && !getLocationStatus(x_l, y_l) && arrayLocation[x_l][y_l].p == 0){
            arrLI[i + 1] = [];
            arrLI[i].push({x: x_l, y: y_l, number: i + 1});
            arrayLocation[x_l][y_l].p = 1;
        }
        if(x_b <= x && y_b >= 0 && !getLocationStatus(x_b, y_b) && arrayLocation[x_b][y_b].p == 0){
            arrLI[i + 1] = [];
            arrLI[i].push({x: x_b, y: y_b, number: i + 1});
            arrayLocation[x_b][y_b].p = 1;
        }
        if(x_r <= x && y_r <= y && !getLocationStatus(x_r, y_r) && arrayLocation[x_r][y_r].p == 0){
            arrLI[i + 1] = [];
            arrLI[i].push({x: x_r, y: y_r, number: i + 1});
            arrayLocation[x_r][y_r].p = 1;
        }
    }

    function getCoordinates(x_loc, y_loc){
        var arr = [];
        arr['x_top'] = (y_loc % 2 == 0) ? x_loc - 1 : x_loc;
        arr['y_top'] = y_loc + 1;
        arr['x_bottom'] = (y_loc % 2 == 0) ? x_loc : x_loc + 1;
        arr['y_bottom'] = y_loc - 1;
        arr['x_left'] = (y_loc % 2 == 0) ? x_loc - 1 : x_loc;
        arr['y_left'] =  arr['y_bottom'];
        arr['x_right'] = (y_loc % 2 == 0) ? x_loc : x_loc + 1;
        arr['y_right'] = arr['y_top'];
        return arr;
    }

    /* КНОПКИ */

    $(document).on('click', '#game_rating', ratingHTML);

    function ratingHTML() {
        $('.container_game').html("<div class='anim'></div><div class='game_button sprite' id='back_menu'></div> <div class='game_button sprite' id='game_play'></div><div class='game_button sprite' id='game_game_rating'></div>");
    }

    $(document).on('click', '#back_menu', closeArcade);

    function closeArcade() {
        $('.container').html('<div class="container_game"><div class="anim"></div><div class="game_button sprite" id="game_arcade"></div> <div class="game_button sprite" id="game_rating"></div> <a href="https://vk.com/zveryata_game " target="_blank"> <div class="game_button sprite" id="game_group"></div> </a> </div>');
    }

    function initMap() {
        $('.container').html(
            '<div class="map"></div>' +
            '<div class="right_menu">' +
            '<div class="back_arcade_game"> ' +
            '<button class="sprite_back_arcade">Главное Меню</button> </div> ' +
            '</div>');
    }

    function gameLevel(){
        initMap();
        $.ajax({
            url: '/vk/animals/level',
            type: 'post',
            data: {vk_id: vk_id},
            success: function(data){
                data = $.parseJSON(data);
                countAnimals = data.count_animals;
                createA('arcade');
                setLocationAnimals(data.spaces_count);
                rightPanelInit();
            }
        });
    }

    $(document).on('click', '#close_arcad', closeArcade);

    $(document).on('click', '.main_menu', closeArcade);

    $(document).on('click', '#game_arcade', function(){
        var lvl = '', lvl_cont = 27;
        $.ajax({
            url: '/vk/animals/get',
            type: 'post',
            data: {vk_id: vk_id, types: ['level', 'countAnimals']},
            success: function(data){
                data = $.parseJSON(data);
                console.log(data);
                $('.lvl').text(levelUser = data.level);
                lvl += "<div class='sprite_cl_ar' id='close_arcad'></div>";
                $('.count_animals').text(countAnimalsUser = data.countAnimals);
                for(var i = 1; i < levelUser; i++)
                    lvl += "<div class='lvl_end lvl_ac sprite_lvl'><div class='information_lvl'>" + (i) + "</div></div>";
                lvl += levelUser <= lvl_cont ? "<div class='lvl_on lvl_ac sprite_lvl' lvl=><div class='information_lvl'>" + (i) + "</div></div>": '';
                for(var i = levelUser + 1; i <= lvl_cont; i++)
                    lvl += "<div class='lvl_off sprite_lvl lvl_ac'><div class='information_lvl'>" + (i) + "</div></div>";
                var html = ' <div class="arcade"><div class="content"><div class="block_levels">' + lvl+ '</div></div></div>';
                $('.container').html(html);
            }
        });
    });

    $(document).on('click', '.lvl_on', gameLevel);

    function addFriends() {
        VK.callMethod("showInviteBox");
    }

    $(document).on('click', '#add_friends', addFriends);

    $(document).on('click', '.back_arcade_game button', function(){
        $('.map').append('<div class="main_menu_on_arcade">' +
            '<div class="top">Вы действительно хотите выйти ?</div>' +
            '<div class="yes sprite_main_menu_on_arcade_yes">ДА</div>' +
            '<div class="no sprite_main_menu_on_arcade_no">НЕТ</div>' +
            '</div>');
        locFunc(0.5, 0, false);
    });

    $(document).on('click', '.main_menu_on_arcade .no', function(){
        locFunc(1, 1, true);
        $('.main_menu_on_arcade').remove();
    });

    $(document).on('click', '.main_menu_on_arcade .yes', closeArcade);

    $(document).on("mouseenter", ".avatar_zv", function() {
        $(this).find('div').css('display', 'block');
    });

    $(document).on("mouseleave", ".avatar_zv", function() {
        $(this).find('div').css('display', 'none');
    });

    $(document).on('click', '#restart_game', gameLevel);

    $(document).on('click', '#invite', addFriends);

    function vkUsersInformation(vk_ids) {
        VK.api("users.get", {
            uids: vk_ids,
            fields: "id,photo_50,first_name,last_name"
        }, function(data) {
            for(var i = 0, j = data.response.length; i < j; i++){
                $('.avatar_user_' + data.response[i].uid).attr('src', data.response[i].photo_50);
                $('.first_name_' + data.response[i].uid).text(data.response[i].first_name);
                $('.last_name_' + data.response[i].uid).text(data.response[i].last_name);
            }
        });
    };

    function rating(type_rating, page) {
        var t = '';
        var vk_ids = '';
        var data = {
            type_rating: type_rating,
            page: page
        };
        if(type_rating == 'friends') data.vk_ids_friends = arrFriends;
        $.ajax({
            url: '/vk/animals/rating',
            type: 'post',
            data: data,
            success: function (data) {
                console.log(data);
                data = $.parseJSON(data);
                for(var i = 0, j = data.data.length; i < j; i++){
                    vk_ids += data.data[i].vk_id + ',';
                    t += '<div class="user_panel user_panel_sprite">' +
                        '<div class="number_user">' +
                        '<button>' + (((page == 1) ? 0 : (page - 1) * 14) + i + 1) + '</button>' +
                        '</div>'+
                        '<img class="avatar_user avatar_user_' + data.data[i].vk_id + '" src="/images/VK/Animals/load.gif"/>' +
                        '<div class="info">' +
                        '<div class="first_name first_name_'+ data.data[i].vk_id + '">Загрузка</div>' +
                        '<div class="last_name last_name_'+ data.data[i].vk_id + '">Загрузка</div>' +
                        '</div>'+
                        '<div class="level">' + data.data[i].count_animals +'</div>' +
                        '</div>';
                }
                var bottom = '';
                var next = '<div class="sprite_next" id="next" page="' + data.next_page + '" type_rating="' + type_rating + '"></div>';
                var pred = '<div class="sprite_pred" id="pred" page="' + data.pred_page + '" type_rating="' + type_rating + '"></div>';
                var invite = '<div class="intive_spring" id="invite"></div>';
                console.log(data);
                if(data.next_page == 'not' && data.pred_page == 'not')
                    t += '<div style="margin-left: 182px; margin-top:180px;cursor:default; ' +
                        'font-size: 54px;font-family: FIRENIGHT-REGULAR;">Рейтинг Пуст</div>'
                else if(data.pred_page == 1 && data.next_page == 'not')
                    bottom += invite;
                else if(data.pred_page == 1){
                    bottom += invite;
                    bottom += next;
                }else if(data.next_page == 'not'){
                    bottom += pred;
                    bottom += invite;
                }else{
                    bottom += pred;
                    bottom += next;
                }
                $('.users').html(t);
                $('.bottom_block').html(bottom);
                vkUsersInformation(vk_ids.substr(0, vk_ids.length - 1));
            }
        });
    }

    $(document).on('click', '#game_game_rating', function () {
        var html = '<div id="rating_fon">' +
            '<div class="panel">' +
            '<div class="block">' +
            '<div class="back_rating back_rating_sprite"></div>'+
            '<div class="logo"></div>'+
            '<div class="menu_rating sprite_rating_menu rating_today" id="rating_today"></div>'+
            '<div class="menu_rating sprite_rating_menu rating_all" id="rating_all"></div>'+
            '<div class="menu_rating sprite_rating_menu rating_friends" id="rating_friends"></div>'+
            '</div>' +
            '</div>'+
            '<div class="panel_rating_user">' +
            '<div class="users"></div>' +
            '<div class="bottom_block"></div>' +
            '</div>';
        $('.container').html(html);
        rating('all', 1);
        $('#rating_all').removeClass('rating_all').addClass('rating_all_off');
        $('#rating_today').removeClass('rating_today_off').addClass('rating_today');
        $('#rating_friends').removeClass('rating_friends_off').addClass('rating_friends');
    });

    $(document).on('click', '.rating_all', function () {
        $('#rating_all').removeClass('rating_all').addClass('rating_all_off');
        $('#rating_today').removeClass('rating_today_off').addClass('rating_today');
        $('#rating_friends').removeClass('rating_friends_off').addClass('rating_friends');
        rating('all', 1);
    });

    $(document).on('click', '.rating_today', function () {
        $('#rating_today').removeClass('rating_today').addClass('rating_today_off');
        $('#rating_all').removeClass('rating_all_off').addClass('rating_all');
        $('#rating_friends').removeClass('rating_friends_off').addClass('rating_friends');
        rating('today', 1);
    });

    $(document).on('click', '.rating_friends', function () {
        $('#rating_today').removeClass('rating_today_off').addClass('rating_today');
        $('#rating_all').removeClass('rating_all_off').addClass('rating_all');
        $('#rating_friends').removeClass('rating_friends').addClass('rating_friends_off');
        rating('friends', 1);
    });

    $(document).on('click', '#next', function () {
        var page = $(this).attr('page');
        var type = $(this).attr('type_rating');
        rating(type, page);
    });

    $(document).on('click', '#pred', function () {
        rating($(this).attr('type_rating'), $(this).attr('page') - 1);
    });

    $(document).on('click', '.back_rating', function () {
        $('.container').html('<div class="container_game"></div>');
        ratingHTML();
    });

    function rightPanelInit() {
        var html = '';
        for(var i = 0; i < countAnimals; i++)
            html += '<div class="avatar_zv" id="avatar_zv_' + arrayTypeAnimals[arrayAnimals[i].type].type + '">' +
                '<div class="info_zv"><div class="top">' + arrayTypeAnimals[arrayAnimals[i].type].name + '</div> </div>' +
                '</div>';
        $('.right_menu').append(html);
    }

    function startGameRating() {
        initMap();
        createA('rating');
        var random = 0;
        ratingCount = 0;
        countAnimals = getRandomInt(1, arrayTypeAnimals.length);
        switch (countAnimals){
            case 1: random = getRandomInt(45, 49);
                break;
            case 2: random = getRandomInt(34, 39);
                break;
            case 3: random = getRandomInt(13, 19);
                break;
            case 4: random = getRandomInt(2, 8);
        }
        setLocationAnimals(random);
        rightPanelInit();
    }

    $(document).on('click', '#game_play', startGameRating);

    $(document).on('click', '.restart_game_rating', startGameRating);

});
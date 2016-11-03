$(document).ready(function(){

    const mainMapLoc = 'loc';

    var x = 13, y = 25, mainMap = '.map', loc_exit = '/images/VK/Animals/loc_exit.jpg',
        classGrass = 'grass', classExit = 'exit', classStop = 'stop',
        randomStart = 0, randomEnd = 0, random = 70,
        arrayLocation = [], arrayAnimals = [], arrayONLocation = [], loc = '', countAnimations;

    const N = x * y;

    var arrayTypeAnimals = [
        {
            type: 'fox',
            step : 1
        },
        {
            type: 'hare',
            step: 2
        }
    ];

    function createA(){
        for(var i = 0; i <= x; i++){
            arrayLocation[i] = [];
            for(var j = 0; j <= y; j++){
                loc = "<div class=" + mainMapLoc + " id=" + mainMapLoc + "_x_" + i + "_y_" + j + " x=" + i + " y=" + j + "></div>";
                $(mainMap).append(loc);
                //$('#' + mainMapLoc + '_x_' + i + '_y_' + j).text(i + '/' + j);
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
                    if(x_top >= 0 && y_top <= y && x_left >= 0 && y_left >= 0 && !getLocationAnimal(i, j) && getLocationStatus(x_top, y_top) && getLocationStatus(x_left, y_left)){
                      $('#' + mainMapLoc + '_x_' + i + '_y_' + j).removeClass().addClass('loc water');
                     }else if(x_top >= 0 && y_top <= y && !getLocationAnimal(i, j) && getLocationStatus(x_top, y_top)){
                      $('#' + mainMapLoc + '_x_' + i + '_y_' + j).removeClass().addClass('loc water_1');
                     }else if(x_left >= 0 && y_left >= 0 && !getLocationAnimal(i, j) && getLocationStatus(x_left, y_left)){
                      $('#' + mainMapLoc + '_x_' + i + '_y_' + j).removeClass().addClass('loc water_2');
                     }//else if(x_left >= 0 && y_left <= y - 1 && getLocationStatus(x_left, y_left)){
                      //  $('#' + mainMapLoc + '_x_' + i + '_y_' + j).removeClass().addClass('loc water');
                    //}
                    else{
                        if(getLocationAnimal(i, j))
                            continue;
                        $('#' + mainMapLoc + '_x_' + i + '_y_' + j).removeClass().addClass('loc stop');
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

    function getCountAnimations(){
        return getRandomInt(0 , getRandomInt(1, 3));
    }

    function getRandomIDTypeAnimal(){
         return getRandomInt(0, arrayTypeAnimals.length - 1);
    }

    function Animals(type, x, y){
        this.type = type;
        this.status = false;
        this.x = x;
        this.y = y;
        this.locationFinish = false;
    }

    function setLocationAnimals(){
         var xT = parseInt(x / 2);
         var yT = parseInt(y / 2);
         var x1 = parseInt(xT);
         var x2 = parseInt(xT + 2);
         var y1 = parseInt(yT - 2);
         var y2 = parseInt(yT + 2);
         var countAnimation = 1; //getCountAnimations();
         countAnimations = countAnimation;
         for(var animal = 0; animal < countAnimations; animal++){
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
           // console.log('На вход2 ' + arrayONLocation[i].x + ' ' + arrayONLocation[i].y);
            var v = li(animal);
            //console.log(v);
            if(v.status){
                arrayAnimals[animal].endLocation = true;
                $('#' + mainMapLoc + '_x_' + arrayAnimals[animal].endX + '_y_' + arrayAnimals[animal].endY).removeClass().
                addClass('loc exit_exit');
                return {
                  status: true,
                  location: v.location
                };
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
                liLocationTEST(arrCoordinates['x_top'], arrCoordinates['y_top'],
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
                    liLocationTEST(arrCoordinates['x_top'], arrCoordinates['y_top'],
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
            return;
        }
        if(arrLI[0].length != 0 && onLocationLength > 0){
           var stepLoc = [];
           var arrLiLength = arrLI.length;
           var indexArrLiLocExit = arrLI[arrLiLength - 2].length - 1;
           var valueArrLiLocExit = arrLI[arrLiLength - 2][indexArrLiLocExit];
            /*
             for(var i = arrLiLength - 1; i >= 0; i--){
             if(arrayAnimals[animal].locationFinish == false) break;
             if(arrLI[i].x == arrayAnimals[animal].locationFinish.x && arrLI[i].y == arrayAnimals[animal].locationFinish.y){
             valueArrLiLocExit = arrayAnimals[animal].locationFinish;
             break;
             }
             }
            */
           $('#' + mainMapLoc + '_x_' + valueArrLiLocExit.x + '_y_' + valueArrLiLocExit.y).text('yes');
           console.log(arrLI[arrLiLength - 2]);
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
                   console.log('Зверь выбрался на волю');
                   arrayLocation[arrayAnimals[animal].x][arrayAnimals[animal].y].status = false;
                   arrayLocation[arrayAnimals[animal].x][arrayAnimals[animal].y].animal = false;
                   $('#' + mainMapLoc + '_x_' + arrayAnimals[animal].x + '_y_' + arrayAnimals[animal].y).removeClass().addClass('loc grass');
                   arrayAnimals[animal].x = arrayONLocation[i].x;
                   arrayAnimals[animal].y = arrayONLocation[i].y;
                   setLocationStatusTrueAnimal(arrayAnimals[animal].x, arrayAnimals[animal].y, arrayAnimals[animal].type);
                   return;
               }
           }
           for(var i = arrLiLength - 3; i >= 0; i--){
              arrCoordinates = getCoordinates(valueArrLiLocExit.x, valueArrLiLocExit.y);
              for(var j = arrLI[i].length - 1; j >= 0; j--){
                  if(arrLI[i][j].number == valueArrLiLocExit.number - 1 && arrLI[i][j].x == arrCoordinates['x_top'] && arrLI[i][j].y == arrCoordinates['y_top']){
                      $('#' + mainMapLoc + '_x_' + arrCoordinates['x_top'] + '_y_' + arrCoordinates['y_top']).text(arrLI[i][j].x + '/' + arrLI[i][j].y);
                      stepLoc.push(valueArrLiLocExit = arrLI[i][j]);
                      break;
                  }
                  else if(arrLI[i][j].number == valueArrLiLocExit.number - 1 && arrLI[i][j].x == arrCoordinates['x_bottom'] && arrLI[i][j].y == arrCoordinates['y_bottom']){
                      $('#' + mainMapLoc + '_x_' + arrCoordinates['x_bottom'] + '_y_' + arrCoordinates['y_bottom']).text(arrLI[i][j].x + '/' + arrLI[i][j].y);
                      stepLoc.push(valueArrLiLocExit = arrLI[i][j]);
                      break;
                  }
                  else if(arrLI[i][j].number == valueArrLiLocExit.number - 1 && arrLI[i][j].x == arrCoordinates['x_left'] && arrLI[i][j].y == arrCoordinates['y_left']){
                      $('#' + mainMapLoc + '_x_' + arrCoordinates['x_left'] + '_y_' + arrCoordinates['y_left']).text(arrLI[i][j].x + '/' + arrLI[i][j].y);
                      stepLoc.push(valueArrLiLocExit = arrLI[i][j]);
                      break;
                  }
                  else if(arrLI[i][j].number == valueArrLiLocExit.number - 1 && arrLI[i][j].x == arrCoordinates['x_right'] && arrLI[i][j].y == arrCoordinates['y_right']){
                      $('#' + mainMapLoc + '_x_' + arrCoordinates['x_right'] + '_y_' + arrCoordinates['y_right']).text(arrLI[i][j].x + '/' + arrLI[i][j].y);
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
         console.log(arrayAnimals[animal]);
         setLocationStatusTrueAnimal(arrayAnimals[animal].x, arrayAnimals[animal].y, arrayAnimals[animal].type);
        } else console.log('Игра окончена');
    }

    $(document).on('click', '.' + mainMapLoc, function(){
        var x_1 = $(this).attr('x');
        var y_1 = $(this).attr('y');
        if(!getLocationStatus(x_1, y_1)){
           setLocationStatusTrue(x_1, y_1);
           for(var animal = 0, l = arrayAnimals.length; animal < l; animal++){
               deleteONLocation(x_1, y_1);
               liClose(animal);
           }
        }
    });

    function createArrLi(arrLi, i){
          if(arrLi[i] == undefined)
             arrLi[i] = [];
    }

    function liLocationTEST(x_t, y_t, x_b, y_b, x_l, y_l, x_r, y_r, arrLI, i){
        if(x_t >= 0 && y_t <= y && !getLocationStatus(x_t, y_t) && arrayLocation[x_t][y_t].p == 0){
            $('#' + mainMapLoc + '_x_' + x_t + '_y_' + y_t).text(i + 1);
            createArrLi(arrLI, i + 1);
            arrLI[i].push({x: x_t,y: y_t,number: i + 1});
            arrayLocation[x_t][y_t].p = 1;
        }
        if(x_l >= 0 && y_l >= 0 && !getLocationStatus(x_l, y_l) && arrayLocation[x_l][y_l].p == 0){
            $('#' + mainMapLoc + '_x_' + x_l + '_y_' + y_l).text(i + 1);
            createArrLi(arrLI, i + 1);
            arrLI[i].push({x: x_l, y: y_l, number: i + 1});
            arrayLocation[x_l][y_l].p = 1;
        }
        if(x_b <= x && y_b >= 0 && !getLocationStatus(x_b, y_b) && arrayLocation[x_b][y_b].p == 0){
            $('#' + mainMapLoc + '_x_' + x_b + '_y_' + y_b).text(i + 1);
            createArrLi(arrLI, i + 1);
            arrLI[i].push({x: x_b, y: y_b, number: i + 1});
            arrayLocation[x_b][y_b].p = 1;
        }
        if(x_r <= x && y_r <= y && !getLocationStatus(x_r, y_r) && arrayLocation[x_r][y_r].p == 0){
            $('#' + mainMapLoc + '_x_' + x_r + '_y_' + y_r).text(i + 1);
            createArrLi(arrLI, i + 1);
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

    createA();
    setLocationAnimals();

  /* КНОПКИ */
    $('#game').on('click', function () {
        //$('.container').html('');
        //$('.container').html("<div class='map'></div><div class='right_menu'></div>");
        //createA();
        //setLocationAnimals();
    });

    $(document).on('click', '#game_rating', function(){
        $('.container_game').html('');
        $('.container_game').html("<div class='game_button sprite' id='back_menu'></div> <div class='game_button sprite' id='game_play'></div><div class='game_button sprite' id='game_game_rating'></div>");
    });

    $(document).on('click', '#back_menu', function(){
        $('.container_game').html('');
        $('.container_game').html("<div class='game_button sprite' id='game_arcade'></div><div class=' sprite game_button' id='game_rating'></div><a href='https://vk.com/zveryata_game' target='_blank'><div class='sprite game_button' id='game_group'></div></a>");
    });

    $(document).on('click', '.close_arcade button', function () {
        var html = '<div class="container_game"> <div class="game_button sprite" id="game_arcade"></div> <div class="game_button sprite" id="game_rating"></div> <a href="https://vk.com/zveryata_game " target="_blank"> <div class="game_button sprite" id="game_group"></div> </a> </div>';
        $('.container').html(html);
    });

    $(document).on('click', '#game_arcade', function(){
        var lvl = '';
        var lvl_cont = 32;
        $.ajax({
            url: '/vk/animals/getlevel',
            type: 'post',
            data: {vk_id: vk_id},
            success: function(data){
                data = $.parseJSON(data);
                levelUser = data.level;
                $('.lvl').text(levelUser);
                for(var i = 1; i < levelUser; i++)
                    lvl += "<div class='lvl_end'>Уровень: " + (i) +"</div>";
                lvl += levelUser <= 32 ? "<div class='lvl_on' lvl=" + levelUser + ">Уровень: " + levelUser +"</div>": '';
                for(var i = levelUser + 1; i <= lvl_cont; i++)
                    lvl += "<div class='lvl_off'>Уровень: " + (i) +"</div>";
                var html = ' <div class="arcade"> <div class="top"> <div class="close_arcade"><button>НАЗАД</button></div> </div> <div class="content">' + lvl+ ' </div> </div>';
                $('.container').html(html);
            }
        });
    });

    $(document).on('click', '.lvl_on', function () {
        alert($(this).attr('lvl'));
    });

    $(document).on('click', '#add_friends', function () {
        VK.callMethod("showInviteBox");
    });

});
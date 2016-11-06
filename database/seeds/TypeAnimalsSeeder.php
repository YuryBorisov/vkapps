<?php

use Illuminate\Database\Seeder;
use App\Models\VK\Animals\TypeAnimals;

class TypeAnimalsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    const PATH_IMAGE = '/images/VK/Animals/';
    public function run(){
        TypeAnimals::truncate();
        $arrTypeAnimal = [
            [
                'type' => 'leo',
                'name' => 'Лев',
                'path_map' => self::PATH_IMAGE.'leo.png',
                'path_avatar' => self::PATH_IMAGE.'leo_avatar.png',
                'avatar_zv' => self::PATH_IMAGE.'avatar_zv_leo.png',
                'step' => '1'
            ],
            [
                'type' => 'tiger',
                'name' => 'Тигр',
                'path_map' => self::PATH_IMAGE.'tiger.png',
                'path_avatar' => self::PATH_IMAGE.'tiger_avatar.png',
                'avatar_zv' => self::PATH_IMAGE.'avatar_zv_tiger.png',
                'step' => '1'
            ],
            [
                'type' => 'krokodil',
                'name' => 'Крокодил',
                'path_map' => self::PATH_IMAGE.'zebra.png',
                'path_avatar' => self::PATH_IMAGE.'krokodil_avatar.png',
                'avatar_zv' => self::PATH_IMAGE.'avatar_zv_krokodil.png',
                'step' => '1'
            ],
            [
                'type' => 'zebra',
                'name' => 'Зебра',
                'path_map' => self::PATH_IMAGE.'zebra.png',
                'path_avatar' => self::PATH_IMAGE.'zebra_avatar.png',
                'avatar_zv' => self::PATH_IMAGE.'avatar_zv_zebra.png',
                'step' => '1'
            ]

        ];
        (new TypeAnimals())->add($arrTypeAnimal);
    }
}

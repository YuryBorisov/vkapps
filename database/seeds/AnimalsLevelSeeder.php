<?php

use Illuminate\Database\Seeder;
use App\Models\VK\Animals\AnimalsLevel;

class AnimalsLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        AnimalsLevel::truncate();
        $arr = [];
        $lvl = 0;
        for($i = 1; $i <= 5; $i++) {
            $arr[] = [
                'count_animals' => 1,
                'spaces_count' => 80 - ($i + 30)
            ];
        }
        for($i = 1; $i <= 8; $i++){
            $arr[] = [
                'count_animals' => 2,
                'spaces_count' => 80 - ($i + 40)
            ];
        }
        for($i = 1; $i <= 7; $i++){
            $arr[] = [
                'count_animals' => 3,
                'spaces_count' => 80 - ($i + 60)
            ];
        }
        for($i = 1; $i <= 7; $i++){
            $arr[] = [
                'count_animals' => 4,
                'spaces_count' => 80 - ($i + 71)
            ];
        }
        (new AnimalsLevel())->add($arr);
    }
}

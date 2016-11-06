<?php

namespace App\Repositories;

abstract class BaseUserRepository extends BaseRepository {

    abstract public function isById($id);

    abstract public function addById($id);

    abstract public function getByIds(array $ids);

    abstract public function addByIds(array $ids);

    abstract  public function getById($id);

}
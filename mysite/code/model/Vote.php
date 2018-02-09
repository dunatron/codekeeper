<?php
namespace MyOrg\Model;

use GraphQL\Type\Definition\ResolveInfo;
use MyOrg\Security\AppUser;
use SilverStripe\GraphQL\Scaffolding\Interfaces\ScaffoldingProvider;
use SilverStripe\GraphQL\Scaffolding\Scaffolders\SchemaScaffolder;
use SilverStripe\ORM\DataObject;
use SilverStripe\Security\Member;


class Vote extends DataObject
{
    private static $db = [
        'Title' => 'Varchar(255)',
    ];

    private static $has_one = [
        'Voter' => AppUser::class,
        'CodeSample'  => CodeSample::class
    ];

    private static $default_sort = 'Created DESC';

    public function canView($member = null)
    {
        return true;
    }

    /**
     * @param Member $member
     * @param array $context Additional context-specific data which might
     * affect whether (or where) this object could be created.
     * @return boolean
     */
    public function canCreate($member = null, $context = array())
    {
        return true;
    }

}

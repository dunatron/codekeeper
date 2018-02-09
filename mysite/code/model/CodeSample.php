<?php
namespace MyOrg\Model;

use GraphQL\Type\Definition\ResolveInfo;
use MyOrg\Security\AppUser;
use SilverStripe\GraphQL\Scaffolding\Interfaces\ScaffoldingProvider;
use SilverStripe\GraphQL\Scaffolding\Scaffolders\SchemaScaffolder;
use SilverStripe\ORM\DataObject;
use SilverStripe\Security\Member;


class CodeSample extends DataObject implements ScaffoldingProvider
{
    private static $db = [
        'Title' => 'Varchar(255)',
        'CodeBody' => 'HTMLText',
    ];

    private static $has_one = [
        'Owner' => AppUser::class,
        'Category' => Category::class
    ];

    private static $has_many = [
        'VotesOnCode' => Vote::class,
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
//        $extended = $this->extendedCan(__FUNCTION__, $member, $context);
//        if ($extended !== null) {
//            return $extended;
//        }
//        return Permission::check('ADMIN', 'any', $member);
        return true;
    }

    public function provideGraphQLScaffolding(SchemaScaffolder $scaffolder)
    {
        $scaffolder
            ->query('SingleCodeSample', __CLASS__)
            ->addArgs([
                'ID' => 'ID!'
            ])
            ->setResolver(function ($object, array $args, $context, ResolveInfo $info) {
                $codeSample = self::get()->byID($args['ID']);
                if (!$codeSample) {
                    throw new \InvalidArgumentException(sprintf(
                        'Code Sample #%s does not exist',
                        $args['ID']
                    ));
                }
                $params = [
                    'ID' => $codeSample->ID,
                ];

                return $codeSample;
            })->setUsePagination(false)
            ->end();

        $scaffolder
            ->query('searchAllCodeSamples', __CLASS__)
            ->addArgs([
                'filter' => 'String!',
            ])
            ->setResolver(function ($object, array $args, $context, ResolveInfo $info) {
                $codeSamples = self::get()->filter([
                    'Title:PartialMatch' => $args['filter'],
                    'CodeBody:PartialMatch' => $args['filter']
                ]);

                return $codeSamples;
            })
            ->setUsePagination(false)
            ->end();

        return $scaffolder;
    }


}
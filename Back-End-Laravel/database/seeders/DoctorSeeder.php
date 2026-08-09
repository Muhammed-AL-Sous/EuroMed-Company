<?php

namespace Database\Seeders;

use App\Models\Doctor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $doctors = [
            [
                'name' => [
                    'ar' => 'الدكتور أحمد راواندزي',
                    'en' => 'Dr.Ahmed.Rawanduzy',
                ],
                'specialization' => [
                    'ar' => 'علاج وجراحة كسور العظام، والتهاب المفاصل، والإصابات الرياضية، وإصابات الركبة. استبدال مفاصل الحوض والركبة.',
                    'en' => 'Treatment and surgery of bone fractures, osteoarthritis, sports injuries and knee injuries Replacement of pelvic and knee joints',
                ]
            ],
            [
                'name' => [
                    'ar' => 'الدكتور محمد الصوص',
                    'en' => 'Dr.Muhammed AL-Sous',
                ],
                'specialization' => [
                    'ar' => 'علاج وجراحة كسور العظام، والتهاب المفاصل، والإصابات الرياضية، وإصابات الركبة. استبدال مفاصل الحوض والركبة.',
                    'en' => 'Treatment and surgery of bone fractures, osteoarthritis, sports injuries and knee injuries Replacement of pelvic and knee joints',
                ]
            ],
            [
                'name' => [
                    'ar' => 'الدكتور بروا دلشاد جاف ',
                    'en' => 'Dr.brwa delshad jaff',
                ],
                'specialization' => [
                    'ar' => 'علاج وجراحة كسور العظام، والتهاب المفاصل، والإصابات الرياضية، وإصابات الركبة. استبدال مفاصل الحوض والركبة.',
                    'en' => 'Treatment and surgery of bone fractures, osteoarthritis, sports injuries and knee injuries Replacement of pelvic and knee joints',
                ]
            ]
        ];

        foreach ($doctors as $doctor) {
            Doctor::create([
                ...$doctor,
                'profile_completed_at' => now(),
            ]);
        }
    }
}

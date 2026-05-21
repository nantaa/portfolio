<?php

namespace App\Filament\Resources\Settings\Schemas;

use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class SettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Setting')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('key')
                                ->required()
                                ->maxLength(100)
                                ->placeholder('hero_email')
                                ->helperText('Unique identifier used by the frontend'),

                            Select::make('group')
                                ->options([
                                    'general'  => 'General',
                                    'hero'     => 'Hero',
                                    'contact'  => 'Contact',
                                    'seo'      => 'SEO',
                                ])
                                ->default('general')
                                ->required(),
                        ]),

                        Textarea::make('value')
                            ->rows(3)
                            ->nullable()
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}


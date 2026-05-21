<?php

namespace App\Filament\Resources\Projects\Schemas;

use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Project Details')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('title')
                                ->required()
                                ->maxLength(255),

                            TextInput::make('category')
                                ->required()
                                ->maxLength(100)
                                ->placeholder('e.g. Fullstack Development'),
                        ]),

                        Grid::make(2)->schema([
                            TextInput::make('year')
                                ->maxLength(4)
                                ->placeholder('2024'),

                            TextInput::make('sort_order')
                                ->numeric()
                                ->default(0),
                        ]),

                        TextInput::make('subtitle')
                            ->maxLength(255)
                            ->placeholder('Next.js · PostgreSQL · Docker'),

                        TextInput::make('image_url')
                            ->url()
                            ->maxLength(500)
                            ->label('Image URL'),

                        TextInput::make('link')
                            ->url()
                            ->maxLength(500)
                            ->label('Project Link'),

                        Toggle::make('is_featured')
                            ->label('Featured')
                            ->default(false),
                    ]),
            ]);
    }
}


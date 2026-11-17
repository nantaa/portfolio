<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds for verified production projects.
     */
    public function run(): void
    {
        $projects = [
            [
                'id' => 1,
                'title' => 'Industrial K3 Compliance Engine',
                'category' => 'Enterprise Workflow',
                'subtitle' => 'Laravel 11 · React 19 Inertia · PostgreSQL · Disnaker Statutory SLA Pipeline',
                'image_url' => null,
                'link' => null,
                'demo_type' => 'iframe',
                'demo_url' => '/projects/moriku/index.html',
                'badge_label' => 'K3',
                'tech_stack' => 'Laravel 11, React 19, Inertia, PostgreSQL, Disnaker SLA',
                'blueprint_theme' => '#ba6617',
                'year' => '2026',
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'id' => 2,
                'title' => 'Indonesian 3D Material Studies',
                'category' => 'Realtime 3D & GLSL',
                'subtitle' => 'Three.js · Procedural GLSL Shaders · PBR Water & Volumetric Fog',
                'image_url' => null,
                'link' => '/raja_ampat_snorkel_day.html',
                'demo_type' => 'diorama',
                'demo_url' => '/raja_ampat_snorkel_day.html',
                'badge_label' => '3D',
                'tech_stack' => 'Three.js, WebGL, GLSL Shaders, PBR Materials',
                'blueprint_theme' => '#00a8ff',
                'year' => '2026',
                'sort_order' => 2,
                'is_featured' => true,
            ],
            [
                'id' => 3,
                'title' => 'TATA$ — 3D Showcase Landing Page',
                'category' => 'Realtime 3D & E-Commerce',
                'subtitle' => 'Vue 3 · Three.js r128 · GLTF Pipeline · GSAP ScrollTrigger',
                'image_url' => null,
                'link' => '/projects/tata/index.html',
                'demo_type' => 'iframe',
                'demo_url' => '/projects/tata/index.html',
                'badge_label' => 'GLTF',
                'tech_stack' => 'Vue 3, Three.js, GSAP, GLTF, Vite',
                'blueprint_theme' => '#e67e22',
                'year' => '2026',
                'sort_order' => 3,
                'is_featured' => true,
            ],
            [
                'id' => 4,
                'title' => 'Academic Docket & Registry',
                'category' => 'Enterprise System',
                'subtitle' => 'Distributed Micro-frontends · Next.js 15 · Redis Cache',
                'image_url' => null,
                'link' => null,
                'demo_type' => 'interactive',
                'demo_url' => null,
                'badge_label' => 'REG',
                'tech_stack' => 'Next.js 15, Redis, PostgreSQL, Micro-frontends',
                'blueprint_theme' => '#3498db',
                'year' => '2025',
                'sort_order' => 4,
                'is_featured' => false,
            ],
            [
                'id' => 5,
                'title' => 'Delta IT Helpdesk & Asset Matrix',
                'category' => 'Infrastructure / Tooling',
                'subtitle' => 'Internal Service Ticketing · SLA Monitoring · Inventory Control',
                'image_url' => null,
                'link' => null,
                'demo_type' => 'interactive',
                'demo_url' => null,
                'badge_label' => 'IT',
                'tech_stack' => 'React 19, TypeScript, Tailwind, REST API',
                'blueprint_theme' => '#9b59b6',
                'year' => '2025',
                'sort_order' => 5,
                'is_featured' => false,
            ],
            [
                'id' => 6,
                'title' => 'Geopetak — Spatial Data Viewer',
                'category' => 'GIS / Spatial Engineering',
                'subtitle' => 'Leaflet · GeoJSON · Vector Tile Pipeline · Aerial Imagery',
                'image_url' => null,
                'link' => null,
                'demo_type' => 'interactive',
                'demo_url' => null,
                'badge_label' => 'GIS',
                'tech_stack' => 'Leaflet, GeoJSON, Vector Tiles, Spatial Analysis',
                'blueprint_theme' => '#10b981',
                'year' => '2025',
                'sort_order' => 6,
                'is_featured' => false,
            ],
            [
                'id' => 7,
                'title' => 'Distributed Expense Engine',
                'category' => 'Financial Tooling',
                'subtitle' => 'Double-entry Bookkeeping · Real-time Currency Conversion',
                'image_url' => null,
                'link' => null,
                'demo_type' => 'interactive',
                'demo_url' => null,
                'badge_label' => 'FIN',
                'tech_stack' => 'TypeScript, React 19, Recharts, Financial Models',
                'blueprint_theme' => '#f59e0b',
                'year' => '2025',
                'sort_order' => 7,
                'is_featured' => false,
            ],
            [
                'id' => 8,
                'title' => 'Makna Works Brand Guidelines',
                'category' => 'Brand & Design Systems',
                'subtitle' => 'Design Tokens · Component Architecture · Style Archetypes',
                'image_url' => null,
                'link' => null,
                'demo_type' => 'interactive',
                'demo_url' => null,
                'badge_label' => 'DS',
                'tech_stack' => 'Design Tokens, CSS Modules, Typography, Figma',
                'blueprint_theme' => '#ffffff',
                'year' => '2024',
                'sort_order' => 8,
                'is_featured' => false,
            ],
        ];

        foreach ($projects as $project) {
            Project::updateOrCreate(
                ['id' => $project['id']],
                $project
            );
        }
    }
}


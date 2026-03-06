# 🎵 Audio System - Architecture & Flow

## 📐 Architecture générale

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Nzébi                        │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
    ┌───▼────┐              ┌────▼───┐
    │WordDetail   │              │SearchPage│
    │Page         │              │          │
    └───┬────┘              └────┬───┘
        │                         │
        │    ┌──────────────────────┬─────────┐
        │    │                      │         │
    ┌───▼────▼──┐         ┌────────▼────┐    │
    │ useAudio  │         │ AudioWordCard│    │
    │ Hook      │         │              │    │
    └───┬───────┘         └───┬──────────┘    │
        │                     │                │
        └──────────┬──────────┘                │
                   │                          │
            ┌──────▼────────────┐             │
            │  audioService     │             │
            │  - getAudioUrl()  │             │
            │  - playWordAudio()│             │
            └──────┬────────────┘             │
                   │                          │
         ┌─────────┴──────────┐               │
         │                    │               │
    ┌────▼──────┐      ┌─────▼────┐          │
    │audioRoutes│      │audioIntegration     │
    │- generate │      │- getAudioFor       │
    │  URLs     │      │  Word()            │
    └────┬──────┘      └─────┬────┘          │
         │                   │               │
         └─────────┬─────────┘               │
                   │                        │
         ┌─────────▼──────────┐             │
         │  audioConfig       │             │
         │  Configuration &   │             │
         │  Constants         │             │
         └────────────────────┘             │
                                            │
                   ┌────────────────────────┘
                   │
            ┌──────▼──────────┐
            │  public/audio/  │
            │  - mambo.mp3    │
            │  - ekala.mp3    │
            │  - botsi.mp3    │
            │  - ...          │
            └─────────────────┘
```

## 🔄 Flux de lecture audio

```
User clicks "Play"
        │
        ▼
┌───────────────────┐
│  audio.play()     │
│  (Hook)           │
└────────┬──────────┘
         │
         ▼
┌───────────────────────────────┐
│  playWordAudio(wordId)        │
│  (audioService)               │
└────────┬──────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Create Audio Element            │
│  with fallback sources           │
└────────┬─────────────────────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌─────────┐  ┌────────────────┐
│Try .mp3 │  │Try .ogg/.wav   │
└────┬────┘  │/.m4a/old URL   │
     │       └────┬───────────┘
     │            │
     ├────────┬───┘
     │        │
     ▼        ▼
  Success   Fallback
     │        │
     └────┬───┘
          │
          ▼
┌──────────────────────┐
│  Audio plays         │
│  User hears word     │
└──────────────────────┘
```

## 📁 Structure de fichiers

```
project/
│
├── public/
│   ├── audio/                    ← Fichiers audio ici
│   │   ├── mambo.mp3
│   │   ├── ekala.mp3
│   │   ├── botsi.ogg
│   │   └── .gitkeep
│   └── ...
│
├── src/
│   ├── services/
│   │   ├── audioService.ts       ← Fonctions audio
│   │   ├── audioRoutes.ts        ← Génération URLs
│   │   ├── audioIntegration.ts   ← Intégration Word
│   │   └── wordsService.ts       ← Données mots
│   │
│   ├── hooks/
│   │   ├── use-audio.ts          ← Hook React
│   │   └── use-mobile.tsx
│   │
│   ├── config/
│   │   └── audioConfig.ts        ← Configuration
│   │
│   ├── components/
│   │   ├── AudioWordCard.tsx     ← Composant
│   │   ├── AudioSystemTest.tsx   ← Test
│   │   └── ...
│   │
│   └── pages/
│       ├── WordDetail.tsx        ← Mise à jour
│       └── ...
│
└── AUDIO_*.md                    ← Documentation
```

## 🔌 API Endpoints (Routes statiques)

```
GET /audio/mambo.mp3
GET /audio/mambo.ogg
GET /audio/mambo.wav
GET /audio/mambo.m4a

GET /audio/ekala.mp3
GET /audio/botsi.mp3
...
```

## 🔗 Dépendances du système

```
audioService
    ↓
    ├→ audioRoutes (pour générer les URLs)
    │   └→ audioConfig (configuration)
    │
    ├→ Browser Audio API
    │   ├→ Audio() constructor
    │   ├→ audio.play()
    │   └→ audio.pause()
    │
    └→ Fetch API
        └→ fetch() pour vérifier l'existence


use-audio Hook
    ↓
    ├→ React hooks (useState, useCallback)
    ├→ audioService (logique audio)
    └→ Component (pour afficher l'état)


AudioWordCard Component
    ↓
    ├→ use-audio Hook
    ├→ audioRoutes (générer URLs)
    ├→ Word interface
    └→ Lucide icons
```

## 🎯 Hierarchy des services

```
Niveau 1 - Utilisateur
└─> composants et pages

Niveau 2 - Hooks React
└─> use-audio.ts

Niveau 3 - Services métier
├─> audioService.ts (opérations bas niveau)
├─> audioRoutes.ts (URLs et chemins)
└─> audioIntegration.ts (intégration Word)

Niveau 4 - Configuration
└─> audioConfig.ts (constants)

Niveau 5 - Fichiers statiques
└─> public/audio/ (fichiers)
```

## 🔄 Flux de configuration initiale

```
Application Start
        │
        ▼
Load Configuration (audioConfig)
        │
        ├─→ basePath: '/audio'
        ├─→ supportedFormats: ['mp3', 'ogg', 'wav', 'm4a']
        ├─→ maxFileSize: 5MB
        └─→ timeouts: 5000ms
        │
        ▼
Load Words (wordsService)
        │
        ▼
Initialize Audio System
        │
        ├─→ Hooks prêts
        ├─→ Services initialisés
        └─→ Configuration appliquée
        │
        ▼
Ready for audio playback
```

## 🧪 Flux de test

```
Open AudioSystemTest Component
        │
        ▼
Load all words
        │
        ▼
Check audio availability
        │
        ├─→ For each word
        │   ├─→ Get audio URLs
        │   ├─→ Fetch HEAD request
        │   └─→ Record status
        │
        ▼
Display statistics
        │
        ├─→ Total words
        ├─→ Words with audio
        └─→ Coverage percentage
        │
        ▼
User selects word
        │
        ▼
Show detailed testing
        │
        ├─→ Audio URLs
        ├─→ Status de chaque URL
        ├─→ Button to test playback
        └─→ Error messages if any
```

## 📊 Diagramme de fallback

```
User clicks Play
        │
        ▼
┌──────────────────┐
│ Try MP3          │ ← Format préféré
└────┬─────────────┘
     │
  Success? ─→ Play! ✓
     │
     No
     │
     ▼
┌──────────────────┐
│ Try OGG          │
└────┬─────────────┘
     │
  Success? ─→ Play! ✓
     │
     No
     │
     ▼
┌──────────────────┐
│ Try WAV          │
└────┬─────────────┘
     │
  Success? ─→ Play! ✓
     │
     No
     │
     ▼
┌──────────────────┐
│ Try M4A          │
└────┬─────────────┘
     │
  Success? ─→ Play! ✓
     │
     No
     │
     ▼
┌──────────────────────────┐
│ Try url_prononciation    │ ← Ancien système
│ (Legacy)                 │
└────┬─────────────────────┘
     │
  Success? ─→ Play! ✓
     │
     No
     │
     ▼
Error message to user ✗
```

## 🚀 Flux de déploiement

```
Developer commits audio files
        │
        ▼
git add public/audio/*
git commit -m "Add audio files"
git push origin main
        │
        ▼
GitHub Actions build
        │
        ├─→ Run build: npm run build
        │   └─→ Files copied to dist/audio/
        │
        ├─→ Deploy to GitHub Pages
        │   └─→ Files served at /audio/*
        │
        ▼
Users access audios
        │
        ▼
Browser requests /audio/mambo.mp3
        │
        ▼
GitHub Pages serves file
        │
        ▼
Audio plays in browser ✓
```

## 🎨 Performance considerations

```
Initial Load
    ├─→ Small impact (config loaded)
    └─→ Audio files NOT loaded yet

On First Interaction
    ├─→ Audio file fetched on demand
    ├─→ Cached by browser
    └─→ Playback starts

Optional Optimization
    ├─→ preloadAudio(words)
    ├─→ Loads all files in background
    └─→ Better UX but higher initial cost
```

---

**Cette architecture offre:**
- ✅ Modularité (services séparés)
- ✅ Réutilisabilité (hooks React)
- ✅ Fallback intelligent
- ✅ Performance optimisée
- ✅ Facile à maintenir
- ✅ Facile à tester

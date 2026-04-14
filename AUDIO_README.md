# 🎵 Système d'Audio pour le Dictionnaire Nzébi

Système complet de gestion d'audio pour les mots du dictionnaire Nzébi-Français.

## 📁 Structure créée

```
public/
└── audio/                          # Dossier des fichiers audio
    ├── mambo.mp3
    ├── ekala.mp3
    └── ... (tous les fichiers audio des mots)

src/
├── services/
│   ├── audioService.ts             # Service principal d'audio
│   ├── audioRoutes.ts              # Gestion des routes audio
│   └── audioIntegration.ts         # Intégration avec les mots
├── hooks/
│   └── use-audio.ts                # Hook React pour l'audio
└── components/
    └── AudioWordCard.tsx           # Composant carte de mot avec audio
```

## 🚀 Utilisation rapide

### 1. Ajouter des fichiers audio

Placez vos fichiers audio dans `public/audio/` avec le même nom que le mot:

```
public/audio/mambo.mp3
public/audio/ekala.mp3
public/audio/botsi.mp3
```

### 2. Utiliser dans vos composants

```tsx
import { useAudio } from '@/hooks/use-audio';

function MyComponent() {
  const audio = useAudio({ wordId: 'mambo' });

  return (
    <button onClick={audio.play} disabled={audio.isPlaying}>
      Écouter
    </button>
  );
}
```

### 3. Les pages de mots sont automatiquement mises à jour

La page `WordDetail.tsx` utilise automatiquement le nouveau système audio et essaie:
1. D'abord: `/audio/{nom_du_mot}.mp3`
2. En fallback: `url_prononciation` (ancien système)

## 📚 Documentation détaillée

Voir [AUDIO_SETUP_GUIDE.md](./AUDIO_SETUP_GUIDE.md) pour:
- Configuration complète
- Formats supportés
- Routes disponibles
- Dépannage

Voir [AUDIO_EXAMPLES.ts](./AUDIO_EXAMPLES.ts) pour:
- Exemples de code
- Cas d'usage
- Intégration avancée

## 🛠️ Services disponibles

### `audioService.ts` - Fonctions de base

```typescript
// Obtenir l'URL du fichier audio
const url = getAudioUrl('mambo');

// Vérifier si un audio existe
const exists = await checkAudioExists('mambo');

// Lire l'audio
await playWordAudio('mambo');

// Obtenir toutes les URLs de fallback
const urls = getAudioUrlOptions('mambo');
```

### `audioRoutes.ts` - Gestion des routes

```typescript
// Générer l'URL avec base path
const url = generateAudioUrl('mambo', '/');

// Obtenir les URLs de fallback
const urls = generateAudioUrlFallbacks('mambo');

// Obtenir le chemin du fichier
const path = getAudioFilePath('mambo');
```

### `audioIntegration.ts` - Intégration avec les mots

```typescript
import { Word } from '@/services/wordsService';

// Obtenir la meilleure URL pour un mot
const url = getBestAudioUrl(word);

// Obtenir toutes les URLs possibles
const urls = getAllAudioUrls(word);

// Créer un élément audio avec fallback
const audio = createAudioElement(word);

// Précharger l'audio pour plusieurs mots
await preloadAudio(words);

// Vérifier quels mots ont de l'audio
const wordsWithAudio = await checkAudioAvailability(words);
```

### `use-audio.ts` - Hook React

```typescript
const { isPlaying, hasAudio, error, play, checkAudio } = useAudio({
  wordId: 'mambo',
  fileName: 'custom-name', // optionnel
});
```

## 🎯 Formats supportés

Le système essaie les formats dans cet ordre:
1. **MP3** - Format recommandé
2. **OGG** - Fallback pour Firefox
3. **WAV** - Fallback supplémentaire
4. **M4A** - Fallback pour Safari

Vous pouvez utiliser n'importe quel format, le système les essaiera tous.

## 🔧 Configuration

Modifiez `src/services/audioRoutes.ts` pour changer:
- Chemin de base des audios: `basePath: '/audio'`
- Répertoire d'upload: `uploadDir: 'public/audio'`
- Formats supportés: `supportedFormats: ['mp3', 'ogg', 'wav', 'm4a']`
- Taille maximale: `maxFileSize: 5 * 1024 * 1024`

## 📝 Conventions de nommage

### ✅ Correct
- `mambo.mp3`
- `obia-moni.mp3`
- `ekala_word.mp3`

### ❌ Incorrect
- `Mambo.mp3` (majuscules)
- `obia moni.mp3` (espaces)
- `ékala.mp3` (accents)
- `my'word.mp3` (caractères spéciaux)

Le système nettoiera automatiquement les caractères spéciaux.

## 🎛️ Hiérarchie de fallback

Si un fichier audio n'existe pas, le système essaiera:
1. `/audio/{word}.mp3`
2. `/audio/{word}.ogg`
3. `/audio/{word}.wav`
4. `/audio/{word}.m4a`
5. `word.url_prononciation` (ancien système)

Cela garantit la compatibilité même si certains fichiers manquent.

## 🔍 Débogage

### Vérifier si un audio existe

```typescript
const exists = await checkAudioExists('mambo');
console.log('Audio exists:', exists);
```

### Voir les erreurs d'audio

```typescript
const audio = useAudio({ wordId: 'mambo' });
if (audio.error) {
  console.error('Audio error:', audio.error);
}
```

### Ouvrir la console du navigateur (F12)

Les erreurs d'audio y apparaîtront avec détails sur le fichier manquant.

## 🚀 Déploiement

### GitHub Pages

Les fichiers dans `public/audio/` seront automatiquement servis lors du déploiement.

1. Placez les fichiers audio dans `public/audio/`
2. Commitez les changements
3. Poussez vers GitHub
4. Les audios seront disponibles à `/audio/{word}.mp3`

### Serveur personnel

Les fichiers statiques de `public/` sont servis automatiquement par Vite.

## 📊 Statistiques et monitoring

### Vérifier quels mots ont de l'audio

```typescript
import { checkAudioAvailability } from '@/services/audioIntegration';

const words = await getAllWords();
const wordsWithAudio = await checkAudioAvailability(words);
console.log(`${wordsWithAudio.size} mots ont de l'audio`);
```

### Précharger l'audio pour performance

```typescript
import { preloadAudio } from '@/services/audioIntegration';

const words = await getAllWords();
await preloadAudio(words); // Charge tous les audios en arrière-plan
```

## 🐛 Dépannage

| Problème | Solution |
|----------|----------|
| L'audio ne se lit pas | Vérifiez que `public/audio/{word}.mp3` existe |
| Erreur "404 Not Found" | Vérifiez le nom du fichier (sensibilité à la casse) |
| Audio lent à charger | Utilisez `preloadAudio()` pour précharger |
| Format non supporté | Convertissez en MP3, OGG, WAV ou M4A |

## 📖 Plus d'informations

- [AUDIO_SETUP_GUIDE.md](./AUDIO_SETUP_GUIDE.md) - Guide complet de configuration
- [AUDIO_EXAMPLES.ts](./AUDIO_EXAMPLES.ts) - Exemples de code détaillés
- [src/services/audioService.ts](./src/services/audioService.ts) - Documentations API
- [src/hooks/use-audio.ts](./src/hooks/use-audio.ts) - Hook React

## 🎉 Prêt à l'emploi

Les routes audio sont maintenant configurées! Il vous suffit d'ajouter vos fichiers dans `public/audio/` et le système s'occupera du reste.

Bon courage! 🚀

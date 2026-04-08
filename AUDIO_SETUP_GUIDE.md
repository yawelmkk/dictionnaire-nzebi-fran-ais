# Guide d'utilisation du système d'audio pour les mots

## Structure des fichiers audio

Les fichiers audio doivent être stockés dans le dossier `public/audio/` et nommés selon le mot qu'ils représentent.

### Format de nommage

```
public/audio/{nom_du_mot}.mp3
public/audio/{nom_du_mot}.ogg
public/audio/{nom_du_mot}.wav
```

### Exemples

Pour le mot "mambo", placez le fichier audio ici:
```
public/audio/mambo.mp3
```

Pour le mot "ekala", placez le fichier audio ici:
```
public/audio/ekala.mp3
```

## Routes audio disponibles

### Route directe (statique)
```
/audio/{nom_du_mot}.mp3
```

Exemple:
```
/audio/mambo.mp3
```

### Formats supportés

- `.mp3` (préféré)
- `.ogg` (fallback)
- `.wav` (fallback)
- `.m4a` (fallback)

Le système essaie les formats dans cet ordre de préférence.

## Utilisation dans le code

### Hook `useAudio`

Utilisez le hook `useAudio` pour gérer la lecture d'audio d'un mot:

```tsx
import { useAudio } from '@/hooks/use-audio';

export function MyComponent() {
  const audio = useAudio({
    wordId: 'mambo', // Le nom du mot
  });
  
  return (
    <button 
      onClick={audio.play}
      disabled={audio.isPlaying}
    >
      {audio.isPlaying ? 'Lecture...' : 'Écouter'}
    </button>
  );
}
```

### Service `audioService`

Pour un contrôle plus granulaire:

```tsx
import { getAudioUrl, playWordAudio, checkAudioExists } from '@/services/audioService';

// Obtenir l'URL du fichier audio
const url = getAudioUrl('mambo');
// Résultat: /audio/mambo.mp3

// Vérifier si un audio existe
const exists = await checkAudioExists('mambo');

// Lire l'audio
await playWordAudio('mambo');
```

### Service `audioRoutes`

Pour les routes et la gestion des chemins:

```tsx
import { generateAudioUrl, generateAudioUrlFallbacks } from '@/services/audioRoutes';

// Générer l'URL avec un chemin de base
const url = generateAudioUrl('mambo', '/');
// Résultat: /audio/mambo.mp3

// Obtenir les URLs de fallback dans l'ordre de préférence
const urls = generateAudioUrlFallbacks('mambo');
// Résultat: ['/audio/mambo.mp3', '/audio/mambo.ogg', '/audio/mambo.wav', '/audio/mambo.m4a']
```

## Configuration

### Modification de la configuration audio

Les paramètres par défaut sont définis dans [src/services/audioRoutes.ts](src/services/audioRoutes.ts):

```typescript
export const DEFAULT_AUDIO_CONFIG: AudioRouteConfig = {
  basePath: '/audio',                      // Chemin de base des fichiers audio
  uploadDir: 'public/audio',               // Répertoire d'upload
  supportedFormats: ['mp3', 'ogg', 'wav', 'm4a'], // Formats supportés
  maxFileSize: 5 * 1024 * 1024,           // Taille maximale (5MB)
};
```

Pour modifier ces paramètres, mettez à jour la constante `DEFAULT_AUDIO_CONFIG` dans `audioRoutes.ts`.

## Fallback et compatibilité

### Hiérarchie de fallback

1. Essaie de charger depuis `/audio/{word}.mp3`
2. Si échec, essaie `.ogg`
3. Si échec, essaie `.wav`
4. Si échec, essaie `.m4a`
5. En dernier recours, utilise `url_prononciation` (ancien système)

### Gestion des erreurs

Le système capture automatiquement les erreurs et peut revenir aux URLs de prononciation existantes (champ `url_prononciation` du service des mots).

## Exemple complet - Intégration dans WordDetail

Les fichiers audio sont automatiquement intégrés dans la page de détail des mots (`WordDetail.tsx`):

```tsx
// L'application essaie d'abord /audio/{word}.mp3
// Puis revient à word.url_prononciation si le fichier n'existe pas
```

Le bouton "Écouter" s'active automatiquement si:
- Un fichier audio existe dans `/audio/`
- OU un `url_prononciation` est défini

## Recommandations

### Qualité audio
- Résolution: 44100 Hz (minimum 16 bits)
- Compression MP3: 128 kbps ou supérieur
- Durée maximale: 10 secondes par mot

### Nommage
- Utilisez uniquement des caractères alphanumériques et des tirets
- Pas d'espaces ou de caractères spéciaux
- Minuscules uniquement

Exemple valide: `mambo.mp3`, `eka-la.mp3`
Exemple invalide: `Mambo.mp3`, `eka la.mp3`, `eka'la.mp3`

### Organisation
```
public/
├── audio/
│   ├── mambo.mp3
│   ├── ekala.mp3
│   ├── botsi.mp3
│   └── ...
└── ...
```

## Déploiement

### GitHub Pages

Les fichiers audio dans `public/audio/` seront automatiquement servis via la route `/audio/` lors du déploiement sur GitHub Pages.

Vérifiez que:
1. Les fichiers audio sont dans `public/audio/`
2. Les noms correspondent exactement aux noms des mots
3. La route de base est correctement configurée dans `vite.config.ts`

## Dépannage

### L'audio ne se lit pas

1. Vérifiez que le fichier existe: `public/audio/{word}.mp3`
2. Vérifiez le nom exact du fichier (sensibilité à la casse)
3. Ouvrez la console navigateur (F12) pour voir les erreurs
4. Vérifiez les permissions d'accès au fichier

### Format non supporté

Si vous utilisez un format non standard:
1. Convertissez en MP3, OGG, WAV ou M4A
2. Placez le fichier dans `public/audio/`
3. Le système essaiera automatiquement tous les formats

## API complète

Voir [src/services/audioService.ts](src/services/audioService.ts) et [src/services/audioRoutes.ts](src/services/audioRoutes.ts) pour la documentation détaillée des fonctions disponibles.

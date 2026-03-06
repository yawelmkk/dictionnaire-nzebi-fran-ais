# 🚀 Guide de Test et Déploiement du Système Audio

## 📋 Avant de commencer

Assurez-vous que vous avez:
- Les fichiers audio en format `.mp3`, `.ogg`, `.wav` ou `.m4a`
- Les noms des fichiers correspondent aux noms des mots
- Les fichiers sont placés dans `public/audio/`

## 🧪 Tester localement

### 1. Ajouter un fichier audio de test

```bash
# Créez un dossier audio s'il n'existe pas
mkdir -p public/audio

# Ajoutez un fichier audio (ou convertissez un existant)
cp /path/to/audio/mambo.mp3 public/audio/mambo.mp3
```

### 2. Démarrer le serveur de développement

```bash
npm run dev
```

Le serveur démarre généralement sur `http://localhost:8080`

### 3. Tester avec le composant de test

Créez une page de test ou importez le composant:

```tsx
import { AudioSystemTest } from '@/components/AudioSystemTest';

export function TestPage() {
  return <AudioSystemTest />;
}
```

Le composant vous permettra de:
- Voir les statistiques d'audio
- Tester la lecture d'audio
- Vérifier les URLs

### 4. Tester dans la console

Ouvrez la console du navigateur (F12) et testez:

```javascript
// Tester l'URL générée
import { generateAudioUrl } from '@/services/audioRoutes';
const url = generateAudioUrl('mambo');
console.log('Audio URL:', url); // /audio/mambo.mp3

// Vérifier si le fichier existe
fetch('/audio/mambo.mp3', { method: 'HEAD' })
  .then(res => console.log('File exists:', res.ok))
  .catch(err => console.log('File not found:', err));

// Écouter l'audio
const audio = new Audio('/audio/mambo.mp3');
audio.play();
```

### 5. Tester dans la page de détail du mot

1. Allez sur la page d'un mot: `http://localhost:8080/#/mot/1`
2. Vérifiez que le bouton "Écouter" apparaît
3. Cliquez dessus pour tester la lecture

## ✅ Checklist de test

- [ ] Le dossier `public/audio/` existe
- [ ] Les fichiers audio sont dans le bon dossier
- [ ] Les noms des fichiers correspondent aux mots
- [ ] L'extension est correcte (`.mp3`, `.ogg`, etc.)
- [ ] Le serveur de développement fonctionne
- [ ] Les URLs se génèrent correctement
- [ ] Les fichiers sont accessibles (pas d'erreur 404)
- [ ] La lecture d'audio fonctionne
- [ ] Les erreurs sont gérées correctement

## 🚢 Déployer

### Option 1: GitHub Pages

1. **Assurez-vous que les fichiers sont commités**

```bash
git add public/audio/
git commit -m "Add audio files for words"
```

2. **Poussez vers GitHub**

```bash
git push origin main
```

3. **Les fichiers seront automatiquement déployés** sur GitHub Pages

4. **Vérifiez l'accès**

Les fichiers seront disponibles à:
```
https://username.github.io/dictionnaire-nzebi-francais/audio/mambo.mp3
```

### Option 2: Serveur personnel

1. **Compilez le projet**

```bash
npm run build
```

2. **Les fichiers de `public/audio/` seront copiés dans `dist/audio/`**

3. **Déployez le dossier `dist/`** sur votre serveur web

4. **Vérifiez l'accès**

Les fichiers seront disponibles à:
```
https://your-domain.com/audio/mambo.mp3
```

### Option 3: CDN (Cloudinary, AWS S3, etc.)

Si vous utilisez un CDN externe:

1. **Uploadez les fichiers audio sur le CDN**
2. **Modifiez la configuration** pour utiliser les URLs du CDN
3. **Mettez à jour `generateAudioUrl()` dans `audioRoutes.ts`**

```typescript
// Exemple avec CDN
const CDN_BASE_URL = 'https://cdn.example.com/audio';

export const generateAudioUrl = (
  wordId: string,
  baseUrl: string = CDN_BASE_URL,
  format: string = 'mp3'
): string => {
  const path = getAudioFilePath(wordId, format);
  return `${baseUrl}/${path.replace('/audio/', '')}`;
};
```

## 🔍 Vérifier le déploiement

### Vérifier que les fichiers sont déployés

```bash
# Via curl
curl -I https://your-domain.com/audio/mambo.mp3

# Devrait retourner: 200 OK
```

### Vérifier dans le navigateur

```javascript
// Dans la console du navigateur
fetch('/audio/mambo.mp3', { method: 'HEAD' })
  .then(res => console.log('Status:', res.status))
  .catch(err => console.log('Error:', err));
```

## 📊 Monitoring

### Vérifier quels mots ont de l'audio

```typescript
import { checkAudioAvailability } from '@/services/audioIntegration';
import { getAllWords } from '@/services/wordsService';

const words = await getAllWords();
const wordsWithAudio = await checkAudioAvailability(words);
console.log(`${wordsWithAudio.size}/${words.length} mots ont de l'audio`);
```

### Voir les erreurs de chargement

1. Ouvrez la console du navigateur (F12)
2. Allez dans l'onglet "Network"
3. Filtrez par "audio"
4. Cherchez les erreurs 404

## 🐛 Dépannage

### Le bouton "Écouter" ne s'affiche pas

**Causes possibles:**
- Le fichier audio n'existe pas dans `public/audio/`
- Le nom du fichier ne correspond pas au mot
- Le système ne détecte pas le fichier

**Solution:**
1. Vérifiez que le fichier existe: `public/audio/{word}.mp3`
2. Vérifiez le nom exact
3. Redémarrez le serveur de développement

### L'audio ne se lit pas

**Causes possibles:**
- Le fichier est corromptu
- Le format n'est pas supporté
- Problème de permissions

**Solution:**
1. Vérifiez que le fichier audio fonctionne en local
2. Essayez un autre format (`.ogg`, `.wav`)
3. Vérifiez les permissions d'accès au fichier

### Erreur 404 lors du chargement

**Causes possibles:**
- Le chemin est incorrect
- Le fichier n'est pas dans le bon répertoire
- Le serveur ne sert pas les fichiers statiques

**Solution:**
1. Vérifiez le chemin: `/audio/{word}.mp3`
2. Assurez-vous que `public/audio/` est servi comme statique
3. Vérifiez les logs du serveur

### L'audio met longtemps à charger

**Solution:**
- Utilisez `preloadAudio(words)` pour précharger en arrière-plan
- Compressez les fichiers audio
- Utilisez un CDN pour plus de performance

## 📈 Optimisation de performance

### Précharger les audios

```typescript
import { preloadAudio } from '@/services/audioIntegration';

// Au chargement de l'application
const words = await getAllWords();
await preloadAudio(words); // Charge tous les audios
```

### Limiter la résolution audio

- 44100 Hz (standard)
- 128 kbps (compression MP3)
- Durée maximale: 10 secondes par mot

### Utiliser un CDN

- Les fichiers audio sont souvent volumineux
- Utilisez un CDN pour réduire la latence
- Exemple: Cloudinary, AWS S3, Bunny CDN

## 📝 Checklist de déploiement final

- [ ] Tous les fichiers audio sont en `public/audio/`
- [ ] Les noms correspondent aux mots
- [ ] Les fichiers compilent sans erreur
- [ ] Le test local fonctionne
- [ ] Les fichiers sont commités
- [ ] Le déploiement s'est bien déroulé
- [ ] Les URLs sont accessibles
- [ ] La lecture fonctionne en production
- [ ] Les erreurs sont gérées correctement
- [ ] Les performances sont acceptables

## 🎉 C'est prêt!

Si tout fonctionne, vous avez un système d'audio complet et fonctionnel pour votre dictionnaire!

Pour plus de questions, consultez:
- [AUDIO_README.md](./AUDIO_README.md) - Guide rapide
- [AUDIO_SETUP_GUIDE.md](./AUDIO_SETUP_GUIDE.md) - Configuration complète
- [AUDIO_EXAMPLES.ts](./AUDIO_EXAMPLES.ts) - Exemples de code

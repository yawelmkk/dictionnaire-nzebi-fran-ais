# 🎵 Audio System - Quick Reference

## TL;DR - La version courte

1. **Placez les fichiers audio** dans `public/audio/`
2. **Nommez-les** comme les mots: `mambo.mp3`, `ekala.mp3`, etc.
3. **C'est tout!** Le système fonctionne automatiquement

## 📁 Structure

```
public/audio/
├── mambo.mp3
├── ekala.mp3
├── botsi.mp3
└── ... (autres mots)
```

## 🔗 Routes

```
/audio/mambo.mp3
/audio/ekala.mp3
/audio/botsi.ogg
```

## 💻 Code usage

### Hook React
```tsx
const audio = useAudio({ wordId: 'mambo' });
<button onClick={audio.play} disabled={audio.isPlaying}>
  Écouter
</button>
```

### Service direct
```typescript
import { getAudioUrl, playWordAudio } from '@/services/audioService';
const url = getAudioUrl('mambo'); // /audio/mambo.mp3
await playWordAudio('mambo');
```

### Routes
```typescript
import { generateAudioUrl, generateAudioUrlFallbacks } from '@/services/audioRoutes';
const url = generateAudioUrl('mambo');
const urls = generateAudioUrlFallbacks('mambo'); // [.mp3, .ogg, .wav, .m4a]
```

## 📊 Fichiers clés

| Fichier | Usage |
|---------|-------|
| `src/services/audioService.ts` | Fonctions audio de base |
| `src/services/audioRoutes.ts` | Génération d'URLs |
| `src/services/audioIntegration.ts` | Intégration Word |
| `src/hooks/use-audio.ts` | Hook React |
| `src/config/audioConfig.ts` | Configuration |

## 🎯 Formats supportés

- `.mp3` ⭐ Recommandé
- `.ogg` (fallback)
- `.wav` (fallback)
- `.m4a` (fallback)

## ✅ Checklist

- [ ] Fichiers dans `public/audio/`
- [ ] Noms correspondent aux mots
- [ ] Extension valide
- [ ] Minuscules seulement
- [ ] Pas d'espaces ou caractères spéciaux
- [ ] Format valide (mp3/ogg/wav/m4a)

## 🚀 Déployer

```bash
git add public/audio/
git commit -m "Add audio files"
git push origin main
```

GitHub Pages l'ajoutera automatiquement!

## 🧪 Tester

```javascript
// Console du navigateur
fetch('/audio/mambo.mp3', { method: 'HEAD' }).then(r => console.log(r.status));
```

## 📞 Aide

- **Guide complet**: `AUDIO_README.md`
- **Configuration**: `AUDIO_SETUP_GUIDE.md`
- **Exemples**: `AUDIO_EXAMPLES.ts`
- **Déploiement**: `AUDIO_DEPLOYMENT_GUIDE.md`
- **Résumé complet**: `AUDIO_SYSTEM_SUMMARY.md`

## 🎨 Nommage

### ✅ Correct
- mambo.mp3
- obia-moni.mp3
- ekala_word.mp3

### ❌ Incorrect
- Mambo.mp3 (majuscule)
- obia moni.mp3 (espace)
- ékala.mp3 (accent)

## 🔄 Fallback automatique

L'app essaie dans cet ordre:
1. `/audio/{word}.mp3`
2. `/audio/{word}.ogg`
3. `/audio/{word}.wav`
4. `/audio/{word}.m4a`
5. `word.url_prononciation` (ancien)

## 🚀 Performance

Précharger les audios:
```typescript
import { preloadAudio } from '@/services/audioIntegration';
const words = await getAllWords();
await preloadAudio(words);
```

## 📝 Exemple complet

```tsx
import { useAudio } from '@/hooks/use-audio';
import { Volume2 } from 'lucide-react';

function WordCard({ word }) {
  const audio = useAudio({ wordId: word.nzebi_word });
  
  return (
    <div>
      <h3>{word.nzebi_word}</h3>
      <button onClick={audio.play} disabled={audio.isPlaying}>
        <Volume2 /> Écouter
      </button>
    </div>
  );
}
```

---

**Besoin de plus de détails?** Lisez la documentation complète! 📚

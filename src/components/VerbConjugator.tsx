import React from 'react';

interface VerbConjugatorProps {
  verb: string;
  tense: string;
}

const VerbConjugator: React.FC<VerbConjugatorProps> = ({ verb, tense }) => {
  // French conjugation patterns (simplified)
  const getConjugation = () => {
    // Check if it's an -er, -ir or -re verb
    const isErVerb = verb.endsWith('er');
    const isIrVerb = verb.endsWith('ir');
    const isReVerb = verb.endsWith('re');
    
    // Get the verb stem
    let stem = '';
    if (isErVerb) {
      stem = verb.slice(0, -2);
    } else if (isIrVerb) {
      stem = verb.slice(0, -2);
    } else if (isReVerb) {
      stem = verb.slice(0, -2);
    } else {
      return verb; // Unable to conjugate
    }

    // Prepare stems for different tenses
    const futurStem = isErVerb ? verb : (isIrVerb || isReVerb) ? verb.slice(0, -1) : verb;
    const condStem = futurStem;
    const participle = isErVerb ? `${stem}é` : isIrVerb ? `${stem}i` : `${stem}u`;
    
    // Conjugate based on tense
    switch (tense.toLowerCase()) {
      case 'présent':
        return isErVerb ? 
          `Je ${stem}e\nTu ${stem}es\nIl/Elle ${stem}e\nNous ${stem}ons\nVous ${stem}ez\nIls/Elles ${stem}ent` :
          isIrVerb ?
          `Je ${stem}is\nTu ${stem}is\nIl/Elle ${stem}it\nNous ${stem}issons\nVous ${stem}issez\nIls/Elles ${stem}issent` :
          `Je ${stem}s\nTu ${stem}s\nIl/Elle ${stem}\nNous ${stem}ons\nVous ${stem}ez\nIls/Elles ${stem}ent`;
      
      case 'imparfait':
        return isErVerb ?
          `Je ${stem}ais\nTu ${stem}ais\nIl/Elle ${stem}ait\nNous ${stem}ions\nVous ${stem}iez\nIls/Elles ${stem}aient` :
          isIrVerb ?
          `Je ${stem}issais\nTu ${stem}issais\nIl/Elle ${stem}issait\nNous ${stem}issions\nVous ${stem}issiez\nIls/Elles ${stem}issaient` :
          `Je ${stem}ais\nTu ${stem}ais\nIl/Elle ${stem}ait\nNous ${stem}ions\nVous ${stem}iez\nIls/Elles ${stem}aient`;
      
      case 'futur':
        return `Je ${futurStem}ai\nTu ${futurStem}as\nIl/Elle ${futurStem}a\nNous ${futurStem}ons\nVous ${futurStem}ez\nIls/Elles ${futurStem}ont`;
      
      case 'passé composé':
        return `J'ai ${participle}\nTu as ${participle}\nIl/Elle a ${participle}\nNous avons ${participle}\nVous avez ${participle}\nIls/Elles ont ${participle}`;
      
      case 'conditionnel':
        return `Je ${condStem}ais\nTu ${condStem}ais\nIl/Elle ${condStem}ait\nNous ${condStem}ions\nVous ${condStem}iez\nIls/Elles ${condStem}aient`;
      
      case 'subjonctif':
        return isErVerb ?
          `Que je ${stem}e\nQue tu ${stem}es\nQu'il/elle ${stem}e\nQue nous ${stem}ions\nQue vous ${stem}iez\nQu'ils/elles ${stem}ent` :
          isIrVerb ?
          `Que je ${stem}isse\nQue tu ${stem}isses\nQu'il/elle ${stem}isse\nQue nous ${stem}issions\nQue vous ${stem}issiez\nQu'ils/elles ${stem}issent` :
          `Que je ${stem}e\nQue tu ${stem}es\nQu'il/elle ${stem}e\nQue nous ${stem}ions\nQue vous ${stem}iez\nQu'ils/elles ${stem}ent`;
      
      default:
        return verb;
    }
  };

  return (
    <div className="whitespace-pre-line text-sm">
      {getConjugation()}
    </div>
  );
};

export default VerbConjugator;

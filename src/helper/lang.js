const lang = {
  en_us: {
    input_placeholder: 'Search',

    speech_listening_label: 'Listening...',
    speech_placeholder_label: 'Say something...',
    speech_voice_config: 'en-US',

    dialog_remove_message: 'Remove item from history?',
    dialog_remove_cancel_btn: 'Cancel',
    dialog_remove_confirm_btn: 'Remove',
  },
  pt_br: {
    input_placeholder: 'Pesquisar',

    speech_listening_label: 'Ouvindo...',
    speech_placeholder_label: 'Fale alguma coisa...',
    speech_voice_config: 'pt-BR',

    dialog_remove_message: 'Remover item do histórico?',
    dialog_remove_cancel_btn: 'Cancelar',
    dialog_remove_confirm_btn: 'Remover',
  },
};

type Key =
  | 'en_us'
  | 'pt_br';

export default function(key: Key) {
  switch (key) {
    case 'pt_br':
      return Object.freeze(Object.assign(lang.en_us, lang.pt_br));
    default:
      return Object.freeze(lang.en_us);
  }
};
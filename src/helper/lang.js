const lang = {
  en_us: {
    input_placeholder: 'Search',

    speech_listening_label: 'Listening...',
    speech_loading_label: 'Starting...',
    speech_failure_label: 'Something wrong, try again',
    speech_stoped_label: 'Ready',
    speech_placeholder_label: 'Say something...',
    speech_restart_label: 'START LISTENING',
    speech_voice_config: 'en-US',

    dialog_remove_message: 'Remove item from history?',
    dialog_remove_cancel_btn: 'Cancel',
    dialog_remove_confirm_btn: 'Remove',
  },
  pt_br: {
    input_placeholder: 'Pesquisar',

    speech_listening_label: 'Ouvindo...',
    speech_loading_label: 'Carregando...',
    speech_failure_label: 'Algo deu errado, tente novamente',
    speech_stoped_label: 'Pronto',
    speech_placeholder_label: 'Fale alguma coisa...',
    speech_restart_label: 'INICIAR NOVAMENTE',
    speech_voice_config: 'pt-BR',

    dialog_remove_message: 'Remover item do histórico?',
    dialog_remove_cancel_btn: 'Cancelar',
    dialog_remove_confirm_btn: 'Remover',
  },
};

export default function(locale, val) {
  const key = val || locale;
  switch (key.replace('-', '_')?.toLowerCase()) {
    case 'pt_br':
      return Object.freeze(Object.assign({}, lang.en_us, lang.pt_br));
    case 'pt_us':
      return Object.freeze(Object.assign({}, lang.en_us, lang.pt_br));
    default:
      return Object.freeze(lang.en_us);
  }
};
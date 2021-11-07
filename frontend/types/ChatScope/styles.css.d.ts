declare const styles: {
  readonly 'cs-main-container': string;
  readonly 'cs-conversation-list': string;
  readonly 'cs-sidebar': string;
  readonly 'cs-sidebar--left': string;
  readonly 'cs-sidebar--right': string;
  readonly 'cs-search': string;
  readonly 'cs-chat-container': string;
  readonly 'cs-expansion-panel': string;
  readonly 'cs-conversation-header': string;
  readonly 'cs-main-container--responsive': string;
  readonly 'cs-conversation-header__back': string;
  readonly 'cs-conversation-header__actions': string;
  readonly 'cs-button--info': string;
  readonly 'cs-conversation': string;
  readonly 'cs-avatar': string;
  readonly 'cs-conversation__content': string;
  readonly 'cs-conversation__operations': string;
  readonly 'cs-conversation__last-activity-time': string;
  readonly 'cs-conversation__unread-dot': string;
  readonly 'cs-message': string;
  readonly 'cs-message__avatar': string;
  readonly 'cs-message__content-wrapper': string;
  readonly 'cs-message__header': string;
  readonly 'cs-message__sender-name': string;
  readonly 'cs-message__sent-time': string;
  readonly 'cs-message__footer': string;
  readonly 'cs-message__content': string;
  readonly 'cs-message--incoming': string;
  readonly 'cs-message--outgoing': string;
  readonly 'cs-message--single': string;
  readonly 'cs-message--first': string;
  readonly 'cs-message--last': string;
  readonly 'cs-message--avatar-spacer': string;
  readonly 'cs-message--avatar-tl': string;
  readonly 'cs-message__message-wrapper': string;
  readonly 'cs-message--avatar-tr': string;
  readonly 'cs-message--avatar-br': string;
  readonly 'cs-message--avatar-bl': string;
  readonly 'cs-message--avatar-cl': string;
  readonly 'cs-message--avatar-cr': string;
  readonly 'cs-message-group': string;
  readonly 'cs-message-group__avatar': string;
  readonly 'cs-message-group__content': string;
  readonly 'cs-message-group__header': string;
  readonly 'cs-message-group__footer': string;
  readonly 'cs-message-group__messages': string;
  readonly 'cs-message-group--incoming': string;
  readonly 'cs-message-group--outgoing': string;
  readonly 'cs-message-group--avatar-tl': string;
  readonly 'cs-message-group--avatar-tr': string;
  readonly 'cs-message-group--avatar-bl': string;
  readonly 'cs-message-group--avatar-br': string;
  readonly 'cs-message-group--avatar-cl': string;
  readonly 'cs-message-group--avatar-cr': string;
  readonly 'cs-message-separator': string;
  readonly 'cs-message-list': string;
  readonly 'cs-message-list__scroll-wrapper': string;
  readonly 'cs-message-list__scroll-to': string;
  readonly 'cs-typing-indicator': string;
  readonly 'cs-message-list__loading-more': string;
  readonly 'cs-loader': string;
  readonly 'cs-message-list__loading-more--bottom': string;
  readonly 'ps__rail-y': string;
  readonly 'cs-avatar--xs': string;
  readonly 'cs-avatar--sm': string;
  readonly 'cs-avatar--md': string;
  readonly 'cs-avatar--lg': string;
  readonly 'cs-avatar--fluid': string;
  readonly 'cs-status': string;
  readonly 'cs-status__bullet': string;
  readonly 'cs-status--xs': string;
  readonly 'cs-status--named': string;
  readonly 'cs-status--sm': string;
  readonly 'cs-status--md': string;
  readonly 'cs-status--lg': string;
  readonly 'cs-avatar-group': string;
  readonly 'cs-avatar--active': string;
  readonly 'cs-avatar--active-on-hover': string;
  readonly 'cs-avatar-group--xs': string;
  readonly 'cs-avatar-group--sm': string;
  readonly 'cs-avatar-group--md': string;
  readonly 'cs-avatar-group--lg': string;
  readonly 'cs-message-input': string;
  readonly 'cs-message-input__content-editor-wrapper': string;
  readonly 'cs-message-input--disabled': string;
  readonly 'cs-message-input__content-editor-container': string;
  readonly 'cs-message-input__content-editor': string;
  readonly 'cs-message-input__tools': string;
  readonly 'cs-button': string;
  readonly 'cs-button--send': string;
  readonly 'cs-button--attachment': string;
  readonly 'cs-input-toolbox': string;
  readonly 'cs-typing-indicator__indicator': string;
  readonly 'cs-typing-indicator__dot': string;
  readonly 'cs-typing-indicator__typing-animation': string;
  readonly 'cs-typing-indicator__text': string;
  readonly 'cs-conversation-header__avatar': string;
  readonly 'cs-conversation-header__content': string;
  readonly 'cs-conversation-header__user-name': string;
  readonly 'cs-conversation-header__info': string;
  readonly 'cs-button--arrow': string;
  readonly 'cs-button--voicecall': string;
  readonly 'cs-button--videocall': string;
  readonly 'cs-button--star': string;
  readonly 'cs-button--adduser': string;
  readonly 'cs-button--ellipsis': string;
  readonly 'cs-conversation--active': string;
  readonly 'cs-conversation__name': string;
  readonly 'cs-conversation__info': string;
  readonly 'cs-conversation__operations--visible': string;
  readonly 'cs-conversation__last-sender': string;
  readonly 'cs-conversation__info-content': string;
  readonly 'cs-unread-anim': string;
  readonly 'cs-conversation__unread': string;
  readonly 'cs-conversation-list__loading-more': string;
  readonly 'cs-status--selected': string;
  readonly 'cs-status__name': string;
  readonly 'cs-bubble-anim': string;
  readonly 'cs-status--available': string;
  readonly 'cs-status--unavailable': string;
  readonly 'cs-status--away': string;
  readonly 'cs-status--dnd': string;
  readonly 'cs-status--invisible': string;
  readonly 'cs-status--eager': string;
  readonly 'cs-status--fluid': string;
  readonly 'cs-expansion-panel__header': string;
  readonly 'cs-expansion-panel__title': string;
  readonly 'cs-expansion-panel__icon': string;
  readonly 'cs-expansion-panel__content': string;
  readonly 'cs-expansion-panel--open': string;
  readonly 'cs-expansion-panel--closed': string;
  readonly 'cs-search__input': string;
  readonly 'cs-search__search-icon': string;
  readonly 'cs-search__clear-icon': string;
  readonly 'cs-search__clear-icon--active': string;
  readonly 'cs-search--disabled': string;
  readonly 'cs-button--border': string;
  readonly 'cs-button--right': string;
  readonly 'cs-button--left': string;
  readonly 'loader-default': string;
  readonly 'cs-loader--content': string;
  readonly 'cs-overlay': string;
  readonly 'cs-overlay__content': string;
  readonly 'cs-overlay--blur': string;
  readonly 'cs-overlay--grayscale': string;
  readonly 'cs-status-list': string;
  readonly 'cs-status-list--xs': string;
  readonly 'cs-status-list--sm': string;
  readonly 'cs-status-list--md': string;
  readonly 'cs-status-list--lg': string;
  readonly 'ps': string;
  readonly 'ps__rail-x': string;
  readonly 'ps--active-x': string;
  readonly 'ps--active-y': string;
  readonly 'ps--focus': string;
  readonly 'ps--scrolling-x': string;
  readonly 'ps--scrolling-y': string;
  readonly 'ps--clicking': string;
  readonly 'ps__thumb-x': string;
  readonly 'ps__thumb-y': string;
  readonly 'scrollbar-container': string;
};
export = styles;


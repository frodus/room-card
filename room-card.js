import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.4.0/lit-element.js?module';

class RoomCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  // Estilos del componente
  static get styles() {
    return css`
      ha-card {
        position: relative;
        overflow: hidden;
        background-size: cover;
        background-position: center;
        --ha-card-background: var(--card-background-color, white);
        color: var(--primary-text-color);
      }
      .overlay {
        background: rgba(0, 0, 0, 0.5);
        padding: 16px;
        position: relative;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      .title {
        font-size: 24px;
        margin: 0;
        color: var(--primary-text-color);
      }
      .display-entity-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      .display-entity {
        font-size: 18px;
        color: var(--primary-text-color);
      }
      .humidity-wrapper {
        display: flex;
        align-items: center;
        margin-top: 5px;
      }
      .humidity-value {
        font-size: 14px;
        color: var(--primary-text-color);
        margin-left: 10px;
        display: flex;
        align-items: center;
      }
      .humidity-value ha-icon {
        margin-right: 5px;
        --mdc-icon-size: 18px;
      }
      .badge-header {
        margin-left: 10px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      .controls {
        display: flex;
        flex-wrap: wrap;
        margin-top: 16px;
        justify-content: space-evenly;
      }
      .controls.aguacatec-true {
        position: relative;
        left: 55%;
        width: 45%;
        margin-bottom: var(--margin-bottom, 0px);
      }
      .control {
        padding: 10px;
        width: calc(50% - 10px);
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;
      }
      .control:hover {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
      }
      .icon-wrapper {
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .control span {
        display: block;
        text-align: center;
        color: var(--primary-text-color);
        margin: 0;
        line-height: 1.2;
      }
      .control .state {
        display: block;
        text-align: center;
        font-size: 12px;
        color: var(--primary-text-color);
        margin-top: 2px;
      }
      .room-icon {
        position: absolute;
        bottom: 20px;
        left: 15px;
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
        width: 20%;
        height: auto;
      }
      .room-icon ha-icon {
        width: 100%;
        height: auto;
        --mdc-icon-size: 100%;
        color: var(--color_icon_room, white);
      }
      .room-icon ha-icon ha-svg-icon {
        background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent);
        border-radius: 50%;
        width: 110%;
        height: 110%;
      }
      .badge {
        position: absolute;
        top: 0;
        right: 0;
        width: 20%;
        height: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: none;
      }

      /* Estilos responsivos */
      @media (max-width: 600px) {
        .room-icon {
          width: 15%;
        }
        .controls.aguacatec-true {
          width: 70%;
          left: 50%;
        }
      }
    `;
  }

  // Configuración de la tarjeta
  setConfig(config) {
    if (!config.title) {
      throw new Error('El título es obligatorio.');
    }
    this.config = config;
  }

  // Renderización de la tarjeta
  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    const backgroundImage = this.config.background || '';
    const controls = this.config.controls || [];
    const titleColor = this.config.title_color || 'var(--primary-text-color)';
    const onColor = this.config.on_color || 'var(--paper-item-icon-active-color)';
    const offColor = this.config.off_color || 'var(--paper-item-icon-color)';
    const textColor = this.config.text_color || 'var(--primary-text-color)';
    const showRoomIcon = this.config.room_icon ? true : false;
    const roomIconColor = this.config.room_icon_color || 'var(--color_icon_room, white)';
    const aguacatec = this.config.aguacatec || false;
    const badge = this.getBadgeInfo();

    const hasDisplayEntity = !!this.config.display_entity;
    const hasHumiditySensor = !!this.config.display_humidity_sensor;

    // Renderizar la entidad de temperatura
    let displayContent = '';
    if (this.config.display_entity) {
      const displayEntity = this.hass.states[this.config.display_entity];
      if (displayEntity) {
        const displayValue = displayEntity.state;
        const displayIcon = this.config.display_icon || displayEntity.attributes.icon || '';
        const displayUnit = this.config.display_unit || displayEntity.attributes.unit_of_measurement || '';
        displayContent = html`
          <div class="display-entity">
            ${displayIcon ? html`<ha-icon icon="${displayIcon}" class="display-icon" style="font-size: 18px;"></ha-icon>` : ''}
            <span class="display-value">${displayValue}${displayUnit}</span>
          </div>
        `;
      }
    }

    // Renderizar la entidad de humedad
    let humidityContent = '';
    if (this.config.display_humidity_sensor) {
      const humidityEntity = this.hass.states[this.config.display_humidity_sensor];
      if (humidityEntity) {
        const humidityValue = humidityEntity.state;
        humidityContent = html`
          <div class="humidity-wrapper">
            ${badge ? html`<div class="badge-header" style="background: ${badge.background};">
              <ha-icon icon="${badge.icon}" style="color: white;"></ha-icon>
            </div>` : ''} <!-- Badge a la izquierda del icono de humedad -->
            <ha-icon icon="mdi:water"></ha-icon>
            <div class="humidity-value">${humidityValue}%</div>
          </div>
        `;
      }
    }

    const controlsStyle = hasDisplayEntity || hasHumiditySensor ? '--margin-bottom: 40px;' : '--margin-bottom: 0px;';

    return html`
      <ha-card style="background-image: url('${backgroundImage}');">
        <div class="overlay" style="background: rgba(0, 0, 0, 0.5);">
          <div class="header">
            <h1 class="title" style="color: ${titleColor};">${this.config.title}</h1>
    
            <!-- Mostrar la temperatura y humedad debajo del título en aguacatec:false -->
            ${!aguacatec
              ? html`
                <div class="display-entity-wrapper">
                  ${displayContent} <!-- Mostrar temperatura -->
                  ${humidityContent} <!-- Mostrar humedad con el badge -->
                </div>
              `
              : ''}
          </div>
    
          <!-- Mostrar el room-icon con el badge en aguacatec:true -->
          ${aguacatec && showRoomIcon
            ? html`<div class="room-icon" style="background: ${this.config.room_icon_background || 'radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent)'};">
                <ha-icon icon="${this.config.room_icon}" class="icon" style="color: ${this.config.room_icon_color || 'var(--primary-text-color)'};"></ha-icon>
              </div>`
            : ''}
    
          <!-- Mostrar la humedad y luego el badge-header en aguacatec:true -->
          ${aguacatec
            ? html`
              <div class="humidity-wrapper">
                <div class="humidity-value">
                  <ha-icon icon="mdi:water"></ha-icon>
                  ${humidityContent} <!-- Aquí muestra el contenido de la humedad -->
                </div>
                ${badge ? html`<div class="badge-header" style="margin-left: 10px; background: ${badge.background};">
                  <ha-icon icon="${badge.icon}" style="color: white;"></ha-icon>
                </div>` : ''}
              </div>`
            : ''}
    
          <!-- Mostrar controles de la tarjeta -->
          <div class="controls ${aguacatec ? 'aguacatec-true' : ''}" style="${controlsStyle}">
            ${controls.map(control => this.renderControl(control, aguacatec))}
          </div>
        </div>
      </ha-card>
    `;
  }

  // Renderización de los controles
  renderControl(control, aguacatec) {
    const entity = this.hass.states[control.entity];
    if (!entity) return html``;

    const icon = control.icon || entity.attributes.icon || 'mdi:help-circle';
    const name = control.name || entity.attributes.friendly_name || 'Dispositivo';
    const state = entity.state;
    const isActive = ['on', 'open', 'playing', 'home'].includes(state);
    const iconColor = isActive ? this.config.on_color || 'var(--paper-item-icon-active-color)' : this.config.off_color || 'var(--paper-item-icon-color)';
    const iconSize = control.icon_size || this.config.icon_size || (aguacatec ? '22px' : '60px');
    const nameFontSize = aguacatec ? '15px' : '18px';
    const textColor = this.config.text_color || 'var(--primary-text-color)';
    const showName = control.show_name !== undefined ? control.show_name : this.config.show_name !== false;
    const showState = control.show_state !== undefined ? control.show_state : this.config.show_state !== false;
    const onBackground = control.on_icon_background || this.config.on_icon_background || '';
    const offBackground = control.off_icon_background || this.config.off_icon_background || '';
    const background = isActive ? onBackground : offBackground;
    const controlPadding = '8px';

    let action = () => {
      this.hass.callService('homeassistant', 'toggle', { entity_id: control.entity });
    };

    if (control.tap_action) {
      action = () => this.handleAction(control.tap_action, control.entity);
    }

    return html`
      <div class="control" @click="${action}" style="padding: ${controlPadding}; width: 50%; background: ${background};">
        <div class="icon-wrapper">
          <ha-icon
            icon="${icon}"
            style="color: ${iconColor}; width: ${iconSize}; height: ${iconSize}; --mdc-icon-size: ${iconSize}; background: ${background};">
          </ha-icon>
        </div>
        ${showName
          ? html`<span style="color: ${textColor}; font-size: ${nameFontSize};">${name}</span>`
          : ''}
        ${showState
          ? html`<span class="state" style="color: ${textColor};">${state}</span>`
          : ''}
      </div>
    `;
  }

  // Método para manejar acciones
  handleAction(actionConfig, defaultEntityId) {
    const action = actionConfig.action || 'more-info';
    switch (action) {
      case 'toggle':
        this.hass.callService('homeassistant', 'toggle', { entity_id: defaultEntityId });
        break;
      case 'more-info':
        const event = new Event('hass-more-info', { composed: true });
        event.detail = { entityId: defaultEntityId };
        this.dispatchEvent(event);
        break;
      case 'call-service':
        const [domain, service] = actionConfig.service.split('.', 2);
        const serviceData = actionConfig.service_data || {};
        this.hass.callService(domain, service, serviceData);
        break;
      case 'navigate':
        if (actionConfig.navigation_path) {
          window.history.pushState(null, '', actionConfig.navigation_path);
          const navEvent = new Event('location-changed', { composed: true });
          this.dispatchEvent(navEvent);
        }
        break;
    }
  }

  // Método para obtener la información del badge
  getBadgeInfo() {
    const displayEntity = this.hass.states[this.config.display_entity];
    if (!displayEntity) return null;

    const temperature = parseFloat(displayEntity.state);
    const humidityEntity = this.hass.states[this.config.display_humidity_sensor]
      ? this.hass.states[this.config.display_humidity_sensor]
      : displayEntity;
    const humidity = humidityEntity ? parseFloat(humidityEntity.state) : 0;

    const maxTemp = this.config.max_temperature || 26;
    const minTemp = this.config.min_temperature || 18;
    const humidityThreshold = this.config.humidity_threshold || 60;

    // Mostrar el badge de humedad o temperatura
    if (humidity >= humidityThreshold) {
      return { icon: 'mdi:water', background: '#2196F3' };
    }
    if (temperature >= maxTemp) {
      return { icon: 'mdi:fire', background: '#f44336' };
    }
    if (temperature <= minTemp) {
      return { icon: 'mdi:snowflake', background: '#2196F3' };
    }

    return null;
  }

  // Tamaño de la tarjeta
  getCardSize() {
    return 3;
  }
}

customElements.define('room-card', RoomCard);

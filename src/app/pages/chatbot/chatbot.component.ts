import { Component, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  time: string;
  error?: boolean;
  colorClass?: string;
}

interface PrediccionResponse {
  _id?: string;
  id_alumno?: string;
  matricula?: string;
  nombre_completo?: string;
  nombre_grupo?: string;
  riesgo?: number;
  motivo?: string;
  recomendacion?: string;
  timestamp?: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule], // ✅ IMPORTS AQUÍ
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages: Message[] = [];
  userInput: string = '';
  isTyping: boolean = false;

  awaitingName: boolean = true;
  menuActive: boolean = false;
  awaitingAnotherOp: boolean = false;
  userName: string = '';

  constructor(private apiService: ApiService) {
    this.startConversation();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  scrollToBottom() {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch {}
  }

  startConversation() {
    this.messages = [];
    this.awaitingName = true;
    this.menuActive = false;
    this.awaitingAnotherOp = false;
    this.userName = '';

    this.pushBotMessage(
      '👋 Hola, soy FUTURED, plataforma para la prevención del abandono escolar.\n¿Cómo te llamas?'
    );
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: this.userInput,
      time: this.getTime(),
    };
    this.messages.push(userMsg);

    const input = this.userInput.trim().toLowerCase();
    this.userInput = '';

    if (this.awaitingName) {
      this.userName = input;
      this.awaitingName = false;
      this.menuActive = true;

      this.pushBotMessage(`Hola ${this.userName}, ¿cómo te puedo ayudar hoy?`);
      this.showMenu();
      return;
    }

    // ✅ Detectar matrícula directamente (solo números)
    if (!this.menuActive && /^[0-9]+$/.test(input)) {
      this.getAlumnoData(input);
      return;
    }

    if (this.awaitingAnotherOp) {
      this.handleAnotherOp(input);
      return;
    }

    if (this.menuActive) {
      this.handleMenuOption(input);
    } else {
      this.getAlumnoData(input);
    }
  }

  pushBotMessage(text: string, callback?: () => void) {
    this.messages.push({
      sender: 'bot',
      text,
      time: this.getTime(),
    });
    if (callback) callback();
  }

  showMenu() {
    const menu = `📌 Menú principal:\n
1️⃣ Ver porcentaje de riesgo de deserción\n
2️⃣ Motivos más comunes de abandono\n
3️⃣ Consejos para prevenir la deserción\n
4️⃣ Información de un alumno por matrícula`;
    this.pushBotMessage(menu);
  }

  handleAnotherOp(input: string) {
    if (input === 'si') {
      this.awaitingAnotherOp = false;
      this.menuActive = true;
      this.showMenu();
    } else if (input === 'no') {
      this.pushBotMessage(`Gracias por usar FUTURED, ${this.userName}. Hasta luego 👋`, () =>
        this.startConversation()
      );
    } else {
      this.pushBotMessage('⚠️ Por favor responde "si" o "no".');
    }
  }

  handleMenuOption(option: string) {
    switch (option) {
      case '1':
        this.pushBotMessage('📊 El porcentaje promedio de riesgo de deserción es del 35%.', () =>
          this.askAnotherOperation()
        );
        break;
      case '2':
        this.pushBotMessage(
          '📌 Motivos más comunes de abandono:\n- Problemas económicos\n- Falta de motivación\n- Problemas familiares\n- Dificultades académicas',
          () => this.askAnotherOperation()
        );
        break;
      case '3':
        this.pushBotMessage(
          '✅ Consejos para prevenir la deserción:\n- Mantener seguimiento regular\n- Apoyo emocional y académico\n- Participar en tutorías y actividades\n- Revisar situación socioeconómica',
          () => this.askAnotherOperation()
        );
        break;
      case '4':
        this.pushBotMessage('✏️ Por favor ingresa la matrícula del alumno:');
        this.menuActive = false;
        break;
      default:
        this.pushBotMessage('⚠️ Opción no válida. Selecciona un número del 1 al 4.');
        break;
    }
  }

  askAnotherOperation() {
    this.menuActive = false;
    this.awaitingAnotherOp = true;
    this.pushBotMessage('¿Quieres hacer otra operación? (si/no)');
  }

  getAlumnoData(matricula: string) {
    this.isTyping = true;

    this.apiService.getPrediccion(matricula).subscribe({
      next: (res: PrediccionResponse) => {
        this.isTyping = false;

        let respuesta = '';
        if (res.matricula) respuesta += `📇 Matrícula: ${res.matricula}\n`;
        if (res.nombre_completo) respuesta += `👤 Nombre: ${res.nombre_completo}\n`;
        if (res.nombre_grupo) respuesta += `🏫 Grupo: ${res.nombre_grupo}\n`;
        if (res.riesgo !== undefined) respuesta += `📊 Riesgo: ${res.riesgo}%\n`;
        if (res.motivo) respuesta += `📌 Motivo: ${res.motivo}\n`;
        if (res.recomendacion) respuesta += `✅ Recomendación: ${res.recomendacion}\n`;
        if (res.timestamp)
          respuesta += `⏱️ Fecha: ${new Date(res.timestamp).toLocaleString()}\n`;

        if (!respuesta) respuesta = '⚠️ Matrícula no encontrada.';

        this.pushBotMessage(respuesta, () => this.askAnotherOperation());
      },
      error: (err) => {
        this.isTyping = false;

        let errorMsg = '';
        if (!navigator.onLine) {
          errorMsg = '🌐 Sin conexión a internet. Revisa tu red.';
        } else if (err.status === 0) {
          errorMsg = '❌ No se pudo conectar al servidor. Intenta más tarde.';
        } else {
          errorMsg = `❌ Error al consultar la API: ${err.message || err.statusText || err}`;
        }

        this.pushBotMessage(errorMsg, () => this.askAnotherOperation());
      },
    });
  }
}

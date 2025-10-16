import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;

  messages: Message[] = [];
  isTyping: boolean = false;
  userInputText: string = '';
  estado: string = 'inicio';
  API_BASE: string = 'https://ia-futured.onrender.com';

  constructor(private http: HttpClient) {}

  agregarMensaje(texto: string, tipo: 'user' | 'bot' = 'bot') {
    this.messages.push({ sender: tipo, text: texto });
    setTimeout(() => {
      const chatBox = document.getElementById('chatBox');
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, 50);
  }

  mostrarEscribiendo(callback: () => void) {
    this.isTyping = true;
    setTimeout(() => {
      this.isTyping = false;
      callback();
    }, 1000 + Math.random() * 800);
  }

  mostrarMenu() {
    this.mostrarEscribiendo(() => {
      this.agregarMensaje(`
        <strong>¿Qué deseas hacer?</strong><br>
        1️⃣ Consultar riesgo por matrícula<br>
        2️⃣ Ver motivos comunes de deserción<br>
        3️⃣ Ver porcentajes actuales<br>
        4️⃣ Salir
      `);
      this.estado = 'menu';
    });
  }

  procesarEntrada(texto: string) {
    texto = texto.trim();
    if (!texto) return;

    this.agregarMensaje(texto, 'user');
    const entrada = texto.toLowerCase();

    if (this.estado === 'inicio') {
      this.mostrarEscribiendo(() => {
        this.agregarMensaje("¡Hola! 👋 Soy tu asistente escolar virtual. Estoy aquí para ayudarte.");
        this.mostrarMenu();
      });
    } else if (this.estado === 'menu') {
      switch (entrada) {
        case '1':
          this.mostrarEscribiendo(() => {
            this.agregarMensaje('🔎 Ingresa la matrícula del alumno:');
            this.estado = 'esperando_matricula';
          });
          break;
        case '2':
          this.mostrarEscribiendo(() => {
            this.agregarMensaje(`
              📌 <strong>Motivos comunes de deserción:</strong><br>
              - Problemas económicos<br>
              - Bajo rendimiento académico<br>
              - Falta de motivación<br>
              - Problemas familiares o personales<br>
              - Salud o trabajo
            `);
            this.mostrarMenu();
          });
          break;
        case '3':
          this.mostrarEscribiendo(() => {
            this.agregarMensaje(`
              📊 <strong>Porcentajes de deserción actuales:</strong><br>
              - Alto riesgo (>70%): 18%<br>
              - Riesgo medio (40–69%): 32%<br>
              - Bajo riesgo: 50%
            `);
            this.mostrarMenu();
          });
          break;
        case '4':
          this.mostrarEscribiendo(() => {
            this.agregarMensaje('👋 ¡Gracias por usar el chatbot! Que tengas un excelente día.');
            this.estado = 'confirmar_reiniciar';
          });
          break;
        default:
          this.mostrarEscribiendo(() => {
            this.agregarMensaje('❗ Opción no válida. Intenta con 1, 2, 3 o 4.');
          });
      }
    } else if (this.estado === 'esperando_matricula') {
      this.obtenerPrediccion(texto);
      this.estado = 'esperando_resultado';
    } else if (this.estado === 'confirmar_repetir' || this.estado === 'confirmar_reiniciar') {
      if (entrada === 'sí' || entrada === 'si') {
        this.mostrarMenu();
      } else if (entrada === 'no') {
        this.mostrarEscribiendo(() => { this.agregarMensaje('👍 ¡De acuerdo. Hasta pronto! 😄'); });
      } else {
        this.mostrarEscribiendo(() => { this.agregarMensaje("Por favor responde con 'sí' o 'no'."); });
      }
    }
  }

  sendMessage() {
    const texto = this.userInputText.trim();
    if (!texto) return;
    this.procesarEntrada(texto);
    this.userInputText = '';
  }

  async obtenerPrediccion(matricula: string) {
    this.mostrarEscribiendo(() => { this.agregarMensaje('⏳ Consultando predicción...'); });

    try {
      const data: any = await this.http.post(`${this.API_BASE}/predict/by_matricula`, { matricula }).toPromise();

      let resultado = `<strong>📋 Resultado de predicción:</strong><br>`;
      resultado += `<strong>Matrícula:</strong> ${data.matricula || 'No disponible'}<br>`;
      resultado += `<strong>Motivo:</strong> ${data.motivo || 'No disponible'}<br>`;
      resultado += `<strong>Nombre completo:</strong> ${data.nombre_completo || 'No disponible'}<br>`;
      resultado += `<strong>Grupo:</strong> ${data.nombre_grupo || 'No disponible'}<br>`;
      resultado += `<strong>Recomendación:</strong> ${data.recomendacion || 'No disponible'}<br>`;
      resultado += `<strong>Riesgo:</strong> ${data.riesgo || 'No disponible'}`;

      this.agregarMensaje(resultado);
      this.estado = 'confirmar_repetir';
      this.agregarMensaje("¿Quieres hacer otra consulta? (sí / no)");
    } catch (err) {
      this.agregarMensaje('❌ Error al comunicarse con la API.');
      this.mostrarMenu();
    }
  }
}

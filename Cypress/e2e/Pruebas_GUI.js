Cypress.on("uncaught:exception", () => false);

describe("ES-02 Login del Sistema y Módulos Completos", () => {

  // ---------------------------
  // 🧹 Reset BD + Crear Usuario
  // ---------------------------
  beforeEach(() => {
    cy.task("resetDB");

    cy.visit("/#/registro");

    // Cerrar modal si aparece
    cy.get("body").then(($body) => {
      if ($body.find(".overlay .close-btn").length > 0) {
        cy.get(".overlay .close-btn").click({ force: true });
        cy.wait(300);
      }
    });

    // Registrar admin
    cy.get("input[placeholder='Nombre completo']").type("Julian");
    cy.get("input[placeholder='Apellido']").type("Venegas");
    cy.get("input[placeholder='Nombre de usuario']").type("admin");
    cy.get("input[placeholder='Contraseña']").type("12345");
    cy.get("input[placeholder='Confirmar contraseña']").type("12345");
    cy.contains("Registrar").click();

    // Cerrar modal después de registrar
    cy.get("body").then(($body) => {
      if ($body.find(".overlay .close-btn").length > 0) {
        cy.get(".overlay .close-btn").click({ force: true });
        cy.wait(300);
      }
    });

    cy.url().should("include", "/#/login");
  });



  // -----------------------------------
  // TEST 1 — LOGIN
  // -----------------------------------
  it("ES-02 Login correcto debe entrar al sistema", () => {
    cy.visit("/#/login");

    cy.get("body").then(($body) => {
      if ($body.find(".overlay .close-btn").length > 0) {
        cy.get(".overlay .close-btn").click({ force: true });
        cy.wait(300);
      }
    });

    cy.get("input[placeholder='Usuario']").type("admin");
    cy.get("input[placeholder='Contraseña']").type("12345");
    cy.contains("Ingresar").click();

    cy.contains("📌 Menú Principal", { timeout: 5000 }).should("be.visible");
  });



  // ===================================================
  // MODULE ES-03 — CRUD DOCENTES
  // ===================================================
it("ES-03 Crear docente", () => {
  cy.visit("/#/login");
  cy.get("input[placeholder='Usuario']").type("admin");
  cy.get("input[placeholder='Contraseña']").type("12345");
  cy.contains("Ingresar").click();
  cy.contains("📌 Menú Principal").should("be.visible");

  cy.contains("Docentes").click();

  // Seleccionar botón real
  cy.contains("Agregar Nuevo Docente").click({ force: true });

  // Inputs reales
  cy.get("#idIdentificacion").type("111");
  cy.get("#nombre").type("Carlos Ruiz");
  cy.get("#correo").type("cruiz@mail.com");
  cy.get("select").first().select("MT");
  cy.get("textarea").type("Docente de matemáticas");

  // Botón real de guardar
  cy.contains("Agregar Docente").click({ force: true });

  cy.contains("111").should("exist");
});





  it("ES-03 Editar docente", () => {
  cy.visit("/#/login");
  cy.get("input[placeholder='Usuario']").type("admin");
  cy.get("input[placeholder='Contraseña']").type("12345");
  cy.contains("Ingresar").click();

  cy.contains("Docentes").click();

  cy.contains("Agregar Nuevo Docente").click();
  cy.get("#idIdentificacion").type("222");
  cy.get("#nombre").type("Laura");
  cy.get("#correo").type("laura@mail.com");
  cy.get("select").select("MT");
  cy.get("textarea").type("Prueba edit");
  cy.contains("Agregar Docente").click();

  // Esperar que se recargue
  cy.contains("222").should("exist");

  // EDITAR
  cy.contains("222")
    .parents("tr")
    .find("button")
    .contains("Editar")
    .click();

  cy.get("input[type='text']").first().clear().type("Laura Actualizada");

  cy.contains("Guardar").click();

  cy.contains("Laura Actualizada").should("exist");
});




  it("ES-03 Eliminar docente", () => {
  cy.visit("/#/login");
  cy.get("input[placeholder='Usuario']").type("admin");
  cy.get("input[placeholder='Contraseña']").type("12345");
  cy.contains("Ingresar").click();

  cy.contains("Docentes").click();

  cy.contains("Agregar Nuevo Docente").click();
  cy.get("#idIdentificacion").type("333");
  cy.get("#nombre").type("Eliminar Test");
  cy.get("#correo").type("test@mail.com");
  cy.get("select").select("MT");
  cy.get("textarea").type("Eliminar");
  cy.contains("Agregar Docente").click();

  cy.contains("333").should("exist");

  cy.contains("333")
    .parents("tr")
    .find("button")
    .contains("Eliminar")
    .click();

  // Confirmación automática
  cy.on("window:confirm", () => true);

  cy.contains("333").should("not.exist");
});





  // ===================================================
  // MODULE ES-04 — CRUD MATERIAS
  // ===================================================
it("ES-04 Crear materia", () => {
  cy.visit("/#/login");

  // Login del sistema
  cy.get("input[placeholder='Usuario']").type("admin");
  cy.get("input[placeholder='Contraseña']").type("12345");
  cy.contains("Ingresar").click();

  // Entrar a Materias
  cy.contains("Materias").click();

  // Cerrar modales previos si aparecen
  cy.get("body").then(($body) => {
    if ($body.find(".overlay .close-btn").length > 0) {
      cy.get(".overlay .close-btn").click({ force: true });
      cy.wait(300);
    }
  });

  // Abrir modal de nueva materia
  cy.contains("Agregar Materia").click({ force: true });

  // Verificar que el modal sí abrió
  cy.get(".dialog", { timeout: 2000 }).should("be.visible");

  // Llenar inputs REALES según tu UI
  cy.get("input[placeholder='Nombre de la materia']").type("Matemáticas 1");
  cy.get("select").first().select("A");     // GRUPO
  cy.get("input[placeholder='Número de créditos']").type("3");

  // Guardar
  cy.contains("Guardar Materia").click({ force: true });

  // Esperar recarga simulada
  cy.wait(700);

  // VALIDACIÓN FINAL
  cy.contains("Matemáticas 1").should("exist");
  cy.contains("A").should("exist");
  cy.contains("3").should("exist");
});






  // ===================================================
  // MODULE ES-05 — CARGA DE HORARIOS
  // ===================================================
it("ES-05 Registrar horario", () => {
  cy.visit("/#/login");
  cy.get("input[placeholder='Usuario']").type("admin");
  cy.get("input[placeholder='Contraseña']").type("12345");
  cy.contains("Ingresar").click();

  // Entrar al módulo
  cy.contains("Carga De Horarios").click();

  // Esperar que carguen los selects
  cy.wait(500);

  // 1️⃣ Seleccionar semestre
  cy.get("label").contains("Semestre")
    .next("select")
    .select("Semestre 1");

  // 2️⃣ Seleccionar grupo
  cy.get("label").contains("Grupo")
    .next("select")
    .select("grupo A");

  // 3️⃣ Seleccionar periodo
  cy.get("label").contains("Periodo")
    .next("select")
    .select(1);

  // 4️⃣ Seleccionar materia (primer elemento)
  cy.get("label").contains("Materia")
    .next("select")
    .select(1);

  // 5️⃣ Seleccionar docente (primer elemento)
  cy.get("label").contains("Docente")
    .next("select")
    .select(1);

  // 6️⃣ Ingresar horas
  cy.get("label").contains("Hora Inicio")
    .next("input")
    .type("08:00");

  cy.get("label").contains("Hora Fin")
    .next("input")
    .type("09:00");

  // 7️⃣ Seleccionar días (multiple)
  cy.get("label").contains("Días de la Semana")
    .next("select")
    .select(["Lunes"], { force: true });

  // 8️⃣ Guardar
  cy.contains("Guardar").click({ force: true });

  // 9️⃣ Verificar que se muestre alerta de éxito
  cy.contains("Horario guardado correctamente", { timeout: 2000 }).should("exist");
});





  // ===================================================
  // MODULE ES-06 — VISTA CALENDARIO
  // ===================================================
  it("ES-06 Visualizar calendario", () => {
    cy.visit("/#/login");
    cy.get("input[placeholder='Usuario']").type("admin");
    cy.get("input[placeholder='Contraseña']").type("12345");
    cy.contains("Ingresar").click();

    cy.contains("Vista De Horario").click();

    cy.contains("Horario", { timeout: 3000 }).should("exist");
  });

});

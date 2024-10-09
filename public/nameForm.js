export function createPlayerForm() {
    const formContainer = document.createElement("div");
    formContainer.id = "nameFormContainer";
    Object.assign(formContainer.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });
  
    const form = document.createElement("form");
    Object.assign(form.style, {
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    });
  
    const label = document.createElement("label");
    label.htmlFor = "playerName";
    label.innerText = "Enter your name:";
    label.style.marginBottom = "10px";
    label.style.fontSize = "16px";
    label.style.fontWeight = "bold";
  
    const input = document.createElement("input");
    input.type = "text";
    input.id = "playerName";
    input.required = true;
    Object.assign(input.style, {
      marginBottom: "20px",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      width: "100%",
      boxSizing: "border-box",
    });
  
    const button = document.createElement("button");
    button.type = "submit";
    button.innerText = "Start Game";
    Object.assign(button.style, {
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      backgroundColor: "#EDC9AF",
      color: "white",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    });
  
    button.addEventListener("mouseover", () => {
      button.style.backgroundColor = "#D2B48C";
    });
    button.addEventListener("mouseout", () => {
      button.style.backgroundColor = "#EDC9AF";
    });
  
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(button);
    formContainer.appendChild(form);
  
    return formContainer;
  }
  
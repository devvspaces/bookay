import Form, { _FormEvent } from "../components/form";

export const bookSubmitEvent = (form: Form) => {
    return (e: _FormEvent) => {
        e.preventDefault();
        
        // Get src from image widget
        const imagePublicID = document.querySelector("img")?.getAttribute("data-public-id");
        
        // Set image input field value
        const target = e.target as HTMLFormElement;
        const imageInput = target.querySelector("input[name='image']") as HTMLInputElement;
        imageInput.value = imagePublicID || imageInput.value;
    
        form.handleSubmit(e);
    
    }
}
import { FormEvent, InputHTMLAttributes, Key, SelectHTMLAttributes, TextareaHTMLAttributes, useState } from "react";
import { capitalize, getURL, postURL, WrappedReponse, Dict } from "../src/utils";
import { required } from "../src/validators";

export interface Field {
    name: string,
    label?: string,
    type?: "text" | "number" | "textarea" | "select" | "file" | "password",
    placeholder?: string,
    props?: InputHTMLAttributes<HTMLElement> | TextareaHTMLAttributes<HTMLElement> | SelectHTMLAttributes<HTMLElement>,
    validators?: Array<Function>,
    required?: boolean,
    display?: boolean,
}

export interface InputField extends Field {
    value?: string | number,
}

export interface TextareaField extends InputField {
    rows?: number,
}

export interface SelectField extends InputField {
    choices: string[][] | string[],
}

export type FormField = InputField | TextareaField | SelectField;

type formProps = {
    form: Form,
    children?: React.ReactNode,
    method?: "get" | "post",
    action: string,
    enctype?: string,
    className?: string,
    props?: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
}

type formConstructor = {
    fields: FormField[],
    prefix?: string,
    formGroupClassName?: string,
    inputClassName?: string,
    selectClassName?: string,
    submitText?: string;
    submitClassName?: string;
    method?: "get" | "post";
    successCallback?: successCallbackFn;
    errorCallback?: errorCallbackFn;
    reponseCallback?: reponseCallbackFn;
}

export type StateValidator = {
    name: string,
    setValue: Function,
    stateValue: string,
    validators: Function[],
}

type StateValidators = {
    [key: string]: StateValidator,
}

type FormDataValues = {
    [key: string]: FormDataEntryValue,
}

export type _FormEvent = FormEvent<HTMLFormElement>;

type reponseCallbackFn = (response: WrappedReponse) => void;

type successCallbackArg = { event: _FormEvent, action: string, data: FormData };
type successCallbackFn = ({ event, action, data }: successCallbackArg) => void;

type errorCallbackArg = { event: _FormEvent, errors: { [key: string]: string } };
type errorCallbackFn = ({ event, errors }: errorCallbackArg) => void;

export default class Form {
    fields: FormField[];
    prefix: string;
    formGroupClassName: string;
    inputClassName: string;
    selectClassName: string;
    submitText?: string;
    submitClassName?: string;
    method?: "get" | "post";

    stateValidators: StateValidators = {};

    reponseCallback = (response: WrappedReponse) => { }

    resolveFetchResponse = (event: _FormEvent) => {
        return (response: WrappedReponse) => {
            if (response.success) {
                this.reponseCallback(response)
            } else {
                if (Object.keys(response.data).length > 0) {
                    // Display an error message
                    if (response.data.message) alert(response.data.message)

                    const errors = response.data.errors;

                    if (errors) {
                        this.errorCallback({ event, errors });
                    }
                };
            }
        }
    }

    successCallback({ event, action, data }: successCallbackArg) {
        if (this.method?.toLowerCase() === "post") {
            // Make post request
            const json_data = JSON.stringify(Object.fromEntries(data));
            postURL(action, json_data).then(this.resolveFetchResponse(event));
        } else {
            // Make get request
            getURL(action, data).then(this.resolveFetchResponse(event));
        }
    };

    errorCallback({ errors }: errorCallbackArg) {
        // Set errors
        Object.entries(errors).forEach(([name, error]) => {
            this.stateValidators[name].setValue(error);
        });
    };

    getField(name: string) {
        return this.fields.find(field => field.name === name);
    }

    cleanData(data: { [key: string]: any }) {
        const cleanedData: { [key: string]: any } = {};
        Object.entries(data).forEach(([key, value]) => {
            cleanedData[key] = value;
            if (value && this.getField(key)?.type === "number") {
                cleanedData[key] = Number(value);
            }
        });
        return cleanedData
    }

    constructor({
        fields,
        prefix = "simple-form",
        formGroupClassName = "form-group",
        inputClassName = "form-control",
        selectClassName = "form-select",
        submitText = "Submit",
        submitClassName = "",
        method = "post",
        successCallback = undefined,
        errorCallback = undefined,
        reponseCallback = undefined,
    }: formConstructor) {
        this.fields = fields;
        this.prefix = prefix;
        this.formGroupClassName = formGroupClassName;
        this.inputClassName = inputClassName;
        this.selectClassName = selectClassName;
        this.submitText = submitText;
        this.submitClassName = submitClassName;
        this.method = method;

        if (successCallback !== undefined) {
            this.successCallback = successCallback;
        }

        if (errorCallback !== undefined) {
            this.errorCallback = errorCallback;
        }

        if (reponseCallback !== undefined) {
            this.reponseCallback = reponseCallback;
        }
    }

    buildStateValidator(field: FormField) {
        let { name, validators } = field;
        validators = validators || [];
        validators = [...validators, ...this.getFieldDefaultValidators(field)];
        
        // ignore eslint error
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [stateValue, setValue] = useState("");

        return {
            name: name,
            setValue,
            stateValue,
            validators: validators,
        }
    }

    getFieldDefaultValidators(field: SelectField): Function[];
    getFieldDefaultValidators(field: FormField): Function[];
    getFieldDefaultValidators(field: SelectField) {
        const validators: Function[] = [];
        if (field.required) {
            validators.push(required);
        }

        if (field.type === "select") {
            validators.push((choice: string) => {
                if (choice === "") {
                    return "Please select an option";
                }
                const founds = field.choices.map((choiceItem) => {
                    if (Array.isArray(choiceItem)) {
                        return choiceItem[0] === choice;
                    }
                    return choiceItem === choice;
                });
                if (founds.includes(true)) {
                    return "";
                }
                return "Please select a valid option";
            })
        }

        return validators;
    }

    buildStateValidators() {
        this.fields.forEach((field) => {
            this.stateValidators[field.name] = this.buildStateValidator(field);
        });
    }

    validate(values: FormDataValues): Dict {
        // Validate fields
        const errors = Object.values(this.stateValidators).reduce((previous, stateValidator) => {

            const { name, validators } = stateValidator;

            let value: any = "";

            if (Object.hasOwn(values, name)) {
                value = values[name]
            }

            const text = validators.reduce((error, validator) => {
                return error || (validator(value) || "");
            }, "");

            if (text) {
                return {
                    ...previous,
                    [name]: text,
                };
            }
            return previous;
        }, {});

        return errors;
    }

    handleSubmit = (e: _FormEvent) => {
        e.preventDefault();

        // Reset errors
        this.fields.forEach(({ name }) => {
            this.stateValidators[name].setValue("");
        });

        // Get values
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);
        const values = Object.fromEntries(data.entries());

        const errors = this.validate(values);

        if (Object.keys(errors).length > 0) {
            // Call error callback
            this.errorCallback({ event: e, errors });
        } else {
            // Call the success callback
            this.successCallback({ event: e, action: form.action, data });
        }
    }

    static Form({ form, children, method = "post", action, className, props }: formProps) {
        form.buildStateValidators();

        // Set method
        form.method = method;

        return (
            <form
                action={form.buildUrl(action)}
                method={form.method}
                onSubmit={form.handleSubmit}
                className={className}
                {...props}
            >
                {children}
                {form.render()}
            </form>
        );
    }

    buildUrl(action: string) {
        return "/api" + action;
    }

    render() {
        return (
            <>
                {this.generateFormGroups()}
                {this.generateSubmit()}
            </>
        );
    }

    getFieldID(field: Field) {
        return `${this.prefix}-${field.name}`;
    }

    getLabels() {
        return this.fields.reduce((prev, { name, label }) => {
            let new_label = label || capitalize(name);
            return {
                ...prev,
                [name]: new_label,
            }
        }, {});
    }

    generateLabel(field: Field) {
        return (
            <label htmlFor={this.getFieldID(field)}>{field.label || capitalize(field.name)}</label>
        );
    }

    showField(field: Field) {
        const display = field.display === undefined || field.display;
        if (!display) {
            return "d-none";
        }
    }

    getFieldGroupClassName(field: Field) {
        return `${this.formGroupClassName} ${this.showField(field) || ""}`;
    }

    generateFormGroups() {
       return this.fields.map((field, index) => {
            let errorValue = this.stateValidators[field.name]?.stateValue
            return (
                <div key={index} className={this.getFieldGroupClassName(field)}>
                    {this.generateLabel(field)}
                    {this.generateField(field)}
                    {errorValue ? <p className="form-error">{errorValue}</p> : ""}
                </div>
            );
        })
    }

    getFieldByName(name: string) {
        const field = this.fields.find((field) => field.name === name);
        if (field === undefined) {
            throw new Error(`Field ${name} not found`);
        }
        return field;
    }

    generateFieldByName(name: string) {
        const field = this.getFieldByName(name);
        return this.generateField(field);
    }

    generateField(field: FormField) {
        if (field.type === "textarea") {
            return this.generateTextarea(field);
        } else if (field.type === "select") {
            return this.generateSelect(field as SelectField);
        } else {
            return this.generateInput(field);
        }
    }

    generateInput(field: InputField) {
        return (
            <input
                id={this.getFieldID(field)}
                type={field.type || "text"}
                name={field.name}
                defaultValue={field.value || ""}
                placeholder={field.placeholder || ""}
                className={this.inputClassName}
                required={this.fieldIsRequired(field)}
                {...field.props}
            />
        );
    }

    fieldIsRequired(field: FormField) {
        if (field.display || field.display === undefined) {
            return field.required;
        }
        return false;
    }

    generateTextarea(field: TextareaField) {
        return (
            <textarea
                className={this.inputClassName}
                id={this.getFieldID(field)}
                name={field.name}
                rows={field.rows || 3}
                defaultValue={field.value}
                placeholder={field.placeholder}
                required={this.fieldIsRequired(field)}
                {...field.props}
            />
        )
    }

    generateSelect(field: SelectField) {
        return (
            <select
                className={this.selectClassName} id={this.getFieldID(field)}
                name={field.name} defaultValue={field.value}
                required={this.fieldIsRequired(field)}
                {...field.props}
            >
                <option>{field.placeholder || ""}</option>
                {this.generateSelectOptions(field.choices)}
            </select>
        );
    }

    /**
     * Generate a form field
     * choices can be an array of arrays or an array of strings
     * if it's an array of arrays, the first element is the value
     * and the second element is the label
     * if it's an array of strings, the value and label are the same
     * @param field
     * @returns
     * @memberof Form
     */
    generateSelectOptions(choices: SelectField["choices"]) {
        return choices.map((choice, index) => {
            if (Array.isArray(choice)) {
                return (
                    this.generateSelectOption(index, choice[0], choice[1])
                );
            } else {
                return (
                    this.generateSelectOption(index, choice)
                );
            }
        });
    }

    generateSelectOption(key: Key, value: string, label?: string) {
        return (
            <option key={key} value={value}>{label || capitalize(value)}</option>
        );
    }

    generateSubmit() {
        return (
            <button className={this.submitClassName}>{this.submitText}</button>
        )
    }
}
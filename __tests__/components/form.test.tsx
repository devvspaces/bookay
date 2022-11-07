import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Form, { FormField, SelectField } from '../../components/form'
import { required } from '../../src/validators';


describe('Form builder test', () => {
    const fields: FormField[] = [
        {
            name: "name",
            type: "text",
            value: "John Doe",
            placeholder: "Enter your name",
            required: true,
            props: {
                autoFocus: true
            },
        },
        {
            name: "age",
            type: "number",
            value: 23,
            placeholder: "Enter your age",
            props: {
                min: 18,
                max: 99,
            },
        },
        {
            name: "specialty",
            type: "select",
            required: true,
            choices: [
                ["frontend", "Frontend"],
                ["backend", "Backend"],
                ["fullstack", "Fullstack"],
            ],
        },
        {
            name: "description",
            type: "textarea",
            label: "About you",
            value: "I am a frontend developer",
            placeholder: "Enter your description",
            rows: 5,
        },
    ]

    it('construction', () => {
        const form = new Form({ fields })
        expect(form.fields).toEqual(fields)
        expect(form.prefix).toEqual("simple-form")
        expect(form.formGroupClassName).toEqual("form-group")
        expect(form.submitClassName).toEqual("")
        expect(form.submitText).toEqual("Submit")
        expect(Object.keys(form.stateValidators).length).toEqual(0)

    });

    it('getFieldDefaultValidators name field', () => {
        const form = new Form({ fields })
        const field = fields[0]
        const validators = form.getFieldDefaultValidators(field)
        expect(validators.length).toEqual(1)
        expect(validators[0]).toEqual(expect.any(Function))
    });

    it('getFieldDefaultValidators select field', () => {
        const form = new Form({ fields })
        const field = fields[2]
        const validators = form.getFieldDefaultValidators(field)
        expect(validators.length).toEqual(2)
    });

    it('getFieldDefaultValidators None', () => {
        const form = new Form({ fields })
        const field = fields[1]
        const validators = form.getFieldDefaultValidators(field)
        expect(validators.length).toEqual(0)
    });

    it('buildStateValidator', () => {
        const TestComponent = () => {
            const form = new Form({ fields })
            const stateValidator = form.buildStateValidator(fields[0])
            expect(Object.keys(form.stateValidators).length).toEqual(0)
            expect(stateValidator.name).toBeDefined()
            expect(stateValidator.name).toEqual("name")
            expect(stateValidator.stateValue).toEqual("")
            expect(stateValidator.validators.length).toEqual(1)
            expect(stateValidator.validators[0]).toEqual(required)
            return <div></div>
        }
        render(<TestComponent />)
    });

    it('buildStateValidators', () => {
        const TestComponent = () => {
            const form = new Form({ fields })
            form.buildStateValidators()
            expect(Object.keys(form.stateValidators).length).toEqual(4)
            expect(form.stateValidators.name.name).toEqual("name")
            expect(form.stateValidators.name.stateValue).toEqual("")
            expect(form.stateValidators.name.validators.length).toEqual(1)
            expect(form.stateValidators.name.validators[0]).toEqual(required)
            expect(form.stateValidators.age.name).toEqual("age")
            expect(form.stateValidators.age.stateValue).toEqual("")
            expect(form.stateValidators.age.validators.length).toEqual(0)
            expect(form.stateValidators.specialty.name).toEqual("specialty")
            expect(form.stateValidators.specialty.stateValue).toEqual("")
            expect(form.stateValidators.specialty.validators.length).toEqual(2)
            expect(form.stateValidators.description.name).toEqual("description")
            expect(form.stateValidators.description.stateValue).toEqual("")
            expect(form.stateValidators.description.validators.length).toEqual(0)
            return <div></div>
        }
        render(<TestComponent />)
    });

    it('buildStateValidators with validators', () => {
        const maxLengthValidator = (value: string) => {
            if (value.length < 3) {
                return "Name must be at least 3 characters long"
            }
        }
        const _fields: FormField[] = [
            ...fields,
            {
                name: "level",
                type: "text",
                placeholder: "Enter your level",
                required: true,
                validators: [
                    maxLengthValidator
                ]
            }
        ]

        const TestComponent = () => {
            const form = new Form({ fields: _fields })
            form.buildStateValidators()

            expect(Object.keys(form.stateValidators).length).toEqual(5)

            expect(form.stateValidators.name.name).toEqual("name")
            expect(form.stateValidators.name.stateValue).toEqual("")
            expect(form.stateValidators.name.validators.length).toEqual(1)
            expect(form.stateValidators.name.validators[0]).toEqual(required)

            expect(form.stateValidators.age.name).toEqual("age")
            expect(form.stateValidators.age.stateValue).toEqual("")
            expect(form.stateValidators.age.validators.length).toEqual(0)

            expect(form.stateValidators.specialty.name).toEqual("specialty")
            expect(form.stateValidators.specialty.stateValue).toEqual("")
            expect(form.stateValidators.specialty.validators.length).toEqual(2)

            expect(form.stateValidators.description.name).toEqual("description")
            expect(form.stateValidators.description.stateValue).toEqual("")
            expect(form.stateValidators.description.validators.length).toEqual(0)

            expect(form.stateValidators.level.name).toEqual("level")
            expect(form.stateValidators.level.stateValue).toEqual("")
            expect(form.stateValidators.level.validators.length).toEqual(2)
            expect(form.stateValidators.level.validators[0]).toEqual(expect.any(Function))
            expect(form.stateValidators.level.validators[1]).toEqual(expect.any(Function))

            return <div></div>
        }
        render(<TestComponent />)
    });

    it("getFieldID test", () => {
        const form = new Form({ fields })
        expect(form.getFieldID(fields[0])).toEqual("simple-form-name")
        const form2 = new Form({ fields, prefix: "form" })
        expect(form2.getFieldID(fields[0])).toEqual("form-name")
    });

    it("generate label", () => {
        const form = new Form({ fields })

        render(form.generateLabel(fields[0]));
        expect(screen.getByText("Name")).toBeInTheDocument()

        render(form.generateLabel(fields[1]));
        expect(screen.getByText("Age")).toBeInTheDocument()

        render(form.generateLabel(fields[2]));
        expect(screen.getByText("Specialty")).toBeInTheDocument()

        render(form.generateLabel(fields[3]));
        expect(screen.getByText("About you")).toBeInTheDocument()
    })

    it("creating fields", () => {

        const form = new Form({ fields })
        render(form.generateField(fields[0]));
        expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument()
        expect(screen.getByDisplayValue("John Doe")).toHaveClass("form-control")
        expect(screen.getByDisplayValue("John Doe")).toHaveAttribute("type", "text")
        expect(screen.getByDisplayValue("John Doe")).toBeRequired()
        
        render(form.generateField(fields[2] as SelectField));
        expect(screen.getByText("Frontend")).toBeInTheDocument()
        expect(screen.getByText("Frontend").parentElement).toHaveClass("form-select")
        expect(screen.getByText("Frontend").parentElement).toBeRequired()
        expect(screen.getByText("Backend")).toBeInTheDocument()
        expect(screen.getByText("Fullstack")).toBeInTheDocument()

        render(form.generateField(fields[3]));
        expect(screen.getByDisplayValue("I am a frontend developer")).toBeInTheDocument()
        expect(screen.getByDisplayValue("I am a frontend developer")).toHaveClass("form-control")
        expect(screen.getByDisplayValue("I am a frontend developer")).toHaveAttribute("rows", "5")
        
    });

    it("generate input", () => {
        const form = new Form({ fields })
        render(form.generateInput(fields[0]));
        expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument()
        expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument()
        expect(screen.getByDisplayValue("John Doe")).toHaveClass("form-control")
        expect(screen.getByDisplayValue("John Doe")).toHaveAttribute("type", "text")
        expect(screen.getByDisplayValue("John Doe")).toBeRequired()

        const form2 = new Form({ fields, inputClassName: "customClass" })
        render(form2.generateInput(fields[1]));
        expect(screen.getByPlaceholderText("Enter your age")).toBeInTheDocument()
        expect(screen.getByPlaceholderText("Enter your age")).toHaveClass("customClass")
    })

    it("generate textarea", () => {
        const form = new Form({ fields })
        render(form.generateTextarea(fields[3]));
        expect(screen.getByPlaceholderText("Enter your description")).toBeInTheDocument()
        expect(screen.getByDisplayValue("I am a frontend developer")).toBeInTheDocument()
        expect(screen.getByDisplayValue("I am a frontend developer")).toHaveClass("form-control")
        expect(screen.getByDisplayValue("I am a frontend developer")).toHaveAttribute("rows", "5")
    })

    it("generate textarea custom class", () => {
        const form2 = new Form({ fields, inputClassName: "customClass" })
        render(form2.generateInput(fields[3]));
        expect(screen.getByDisplayValue("I am a frontend developer")).toBeInTheDocument()
        expect(screen.getByDisplayValue("I am a frontend developer")).toHaveClass("customClass")
    })

    it("generate select", () => {
        const form = new Form({ fields })
        render(form.generateSelect(fields[2] as SelectField));
        expect(screen.getByText("Frontend")).toBeInTheDocument()
        expect(screen.getByText("Frontend").parentElement).toHaveClass("form-select")
        expect(screen.getByText("Frontend").parentElement).toBeRequired()
        expect(screen.getByText("Backend")).toBeInTheDocument()
        expect(screen.getByText("Fullstack")).toBeInTheDocument()
    })

    it("generate select custom class", () => {
        const form2 = new Form({ fields, selectClassName: "customClass" })
        render(form2.generateSelect(fields[2] as SelectField));
        expect(screen.getByText("Frontend")).toBeInTheDocument()
        expect(screen.getByText("Frontend").parentElement).toHaveClass("customClass")
    });

    it("generate select options", () => {
        const fields: FormField[] = [
            {
                name: "specialty",
                type: "select",
                required: true,
                choices: [
                    ["Devops"],
                    ["frontend"],
                    ["backend", "Backend"],
                    ["fullstack", "Frontend and Backend Developer"],
                ],
            },
        ]
        const form = new Form({ fields })
        render(form.generateSelect(fields[0] as SelectField));
        expect(screen.getByText("Frontend")).toBeInTheDocument()
        expect(screen.getByText("Frontend").parentElement).toHaveClass("form-select")
        expect(screen.getByText("Frontend").parentElement).toBeRequired()
        expect(screen.getByText("Backend")).toBeInTheDocument()
        expect(screen.getByText("Devops")).toBeInTheDocument()
        expect(screen.getByText("Frontend and Backend Developer")).toBeInTheDocument()
    })

    it("generate submit button", () => {
        const form = new Form({ fields })
        render(form.generateSubmit());
        expect(screen.getByText("Submit")).toBeInTheDocument()
        expect(screen.getByText("Submit")).toHaveAttribute("class")
    })

    it("Generating form groups", () => {

        const form = new Form({ fields })

        const TestComponent = () => {
            return (
                <form>
                    {form.generateFormGroups()}
                </form>
            )
        }

        render(<TestComponent />);

        expect(screen.getByText("Frontend")).toBeInTheDocument()
        expect(screen.getByText("Frontend").parentElement?.parentElement)
            .toHaveClass("form-group")
        
        expect(screen.getByText("Name")).toBeInTheDocument()
        expect(screen.getByText("Name").parentElement).toHaveClass("form-group")
        expect(screen.getByText("Age")).toBeInTheDocument()
        expect(screen.getByText("Age").parentElement).toHaveClass("form-group")
        expect(screen.getByText("Specialty")).toBeInTheDocument()
        expect(screen.getByText("Specialty").parentElement).toHaveClass("form-group")
        expect(screen.getByText("About you")).toBeInTheDocument()
        expect(screen.getByText("About you").parentElement).toHaveClass("form-group")

    });

    const testValues = [
        {
            expected: 2,
            values: {
                "name": "",
                "specialty": "",
                "description": "",
                age: ""
            }
        },
        {
            expected: 1,
            values: {
                "name": "test",
                "specialty": "",
                "description": "",
                age: ""
            }
        },
        {
            expected: 2,
            values: {
                "name": "",
                "specialty": "test",
                "description": "",
                age: ""
            }
        },
        {
            expected: 1,
            values: {
                "name": "",
                "specialty": "frontend",
                "description": "",
                age: ""
            }
        },
        {
            expected: 0,
            values: {
                "name": "test",
                "specialty": "frontend",
                "description": "test",
                age: ""
            }
        },
        {
            expected: 0,
            values: {
                "name": "test",
                "specialty": "frontend",
                "description": "test",
                age: "34"
            }
        }
    ]

    testValues.forEach(({ values, expected }, index) => {

        it(`test validation with values: Test ${index} `, () => {

            let called = false;

            const TestComponent = () => {
                const form = new Form({ fields })
                form.buildStateValidators()

                if (!called) {
                    const result = form.validate(values)
                    called = true;
                    expect(Object.keys(result).length).toBe(expected);
                }
                return <div></div>
            }

            render(<TestComponent />)
        })

    });

    it("form submit testing", () => {

        
        const TestComponent = () => {
            
            const form = new Form({
                fields,
                successCallback: ({ event }) => {}
            })

            return (
                <Form.Form form={form} action=''></Form.Form>
            )
        }

        render(<TestComponent />);

        expect(screen.getByText("Specialty")).toBeInTheDocument()
        expect(screen.getByText("Age")).toBeInTheDocument()
        expect(screen.getByText("Name")).toBeInTheDocument()
        expect(screen.getByText("About you")).toBeInTheDocument()

        fireEvent.submit(screen.getByText("Submit").parentElement as HTMLElement)

        expect(screen.getAllByText(/field is required/).length).toBe(1)
    });  

});
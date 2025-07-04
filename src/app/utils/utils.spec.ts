import { validarRut } from "./utils"


fdescribe("utils",()=>{

    const utils = {
        validarRut:jest.fn()
    }

    describe("validar rut",()=>{
        
        it("debería validar un RUT correcto", () => {
        expect(validarRut("20.183.018-4")).toBe(true);
        });
    
        it("debería rechazar un RUT con DV incorrecto", () => {
        expect(validarRut("20.183.018-9")).toBe(false);
        });
    
        it("debería rechazar un RUT mal formateado", () => {
        expect(validarRut("20183018")).toBe(false);
        });
    })


})
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n(function(){\n    const lat = 9.9388885;\n    const lng = -84.1061096;\n    const mapa = L.map('mapa-inicio').setView([lat, lng ], 15); // el último número (15), es con el que varias \n\n    let markers = new L.featureGroup().addTo(mapa)\n\n    let propiedades = [];\n\n    // Filtros\n    const filtros = {\n        categoria: '',\n        precio: '',\n    }\n\n    const categoriaSelect = document.querySelector('#categorias');\n    const precioSelect = document.querySelector('#precios');\n\n\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n    }).addTo(mapa);\n\n\n    // Filtrado por precios y categorias\n\n    categoriaSelect.addEventListener('change', e => {\n        filtros.categoria = +e.target.value\n        // console.log(+e.target.value)\n        filtrarPropiedades()\n    })\n    precioSelect.addEventListener('change', e => {\n        filtros.precio = +e.target.value\n        // console.log(+e.target.value)\n        filtrarPropiedades()\n    })\n\n    const obtenerPropiedades = async () => {\n        try {\n            const url = \"/api/propiedades\"\n            const respuesta = await fetch(url)\n            propiedades = await respuesta.json() \n\n            mostrarPropiedades(propiedades)\n        } catch (error) {\n            console.log(error)\n        }\n    }\n\n    const mostrarPropiedades = propiedades => {\n        propiedades.forEach( propiedad => {\n            // Agregar los pines\n            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {\n                autoPan: true,\n            })\n                .addTo(mapa)\n                .bindPopup(`\n                <div class=\"space-y-3>\n                    <p class=\"text-center font-bold text-gray-800\"> Categoria: <span class=\" font-extrabold text-indigo-600\"> ${propiedad.categoria.nombre} </span> </p>\n                    <h1 class=\" text-center text-xl font-extrabold my-3 uppercase\">${propiedad?.titulo}</h1>\n                    <img src=\"/uploads/${propiedad?.imagen}\" alt=\"imagen de la propiedad: ${propiedad?.titulo}\">\n                    <p class=\"text-center font-bold text-gray-800\"> Precio: <span class=\" font-extrabold text-indigo-600\"> ${propiedad.precio.nombre} </span> </p>\n                    <a href=\"/propiedad/${propiedad.id}\" class=\"bg-indigo-600 p-2 font-bold hover:bg-indigo-700 uppercase text-center block\"> Ver Propiedad </a>\n                </div>\n                    \n                `)\n\n                markers.addLayer(marker)\n            \n        })\n    }\n\n    const filtrarPropiedades = () => {\n        const resultado = propiedades.filter(filtrarCategorias).filter(filtrarPrecios)\n        console.log(resultado)\n    }\n\n    const filtrarCategorias = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad\n\n    const filtrarPrecios = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad\n    \n\n    \n\n    obtenerPropiedades()\n    \n\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;
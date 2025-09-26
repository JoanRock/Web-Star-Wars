async function obtenerPersonaje() {
    try {
        const response = await fetch("https://swapi.dev/api/people/1/");
        const data1 = await response.json(); // Aquí espera a que se convierta en JSON
        //console.log(data); // Aquí ya tenemos los datos listos

        function f () {

            var people = [];

            data1.getJSON(fetch("https://swapi.dev/api/people/1/", function (data) {
                $.each(function (i, f) {
                    //var tblRow = "<tr>" + "<td>" + f.firstName + "</td>" +
                    //    "<td>" + f.lastName + "</td>" + "<td>" + f.job + "</td>" + "<td>" + f.roll + "</td>" + "</tr>"
                    //$(tblRow).appendTo("#userdata tbody");

                    var tblRow = "<tr>" + "<td>" + f.name + "</td>" +
                        "<td>" + f.height + "</td>" + "<td>" + f.mass + "</td>" + "<td>" + f.hair_color + "</td>" + "</tr>" +
                        "</td>" + "<td>" + f.skin_color + "</td>" + "<td>" + f.eye_color + "</td>" + "<td>" + f.birth_year + 
                        "</td>" + "<td>" + f.gender
                    $(tblRow).appendTo("#userdata tbody");
                });

            }));

        };

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

obtenerPersonaje();
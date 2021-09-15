const DEFAULT_VARCHAR_LEN = 28;
class Field {
    name = "";
    primary = false;
    unique = false;
    auto_increment = false;
    not_null = false;
    foreign_key = false;
    type = "";
    length = 0;

    constructor(name, type) {
        this.name = name;
        this.type = type;
        if(this.type === "VARCHAR")
            this.length = DEFAULT_VARCHAR_LEN;
    }
};
$(document).ready(function () {
    let name = $('#table-name');
    let input = $('#sql-in');
    let output = $('#sql-out');
    let types = $('#sql-type');
    let finalOut = $('#final-out');
    let fields = [];

    $(document).on('change', '#sql-in, #sql-type', function () {
        let inFields = input.val().trim().split(',');
        clearArray(fields);

        for (let i = 0; i < inFields.length; i++) {
            fields.push(new Field(inFields[i], charToSQLType(types.val().charAt(i))));
        }
        var html = "";
        for (let i = 0; i < fields.length; i++) {
            let tmp =
                '<div class="row">' +
                '<div class="col-3">' + fields[i].name + '</div>' +
                '<div class="col-9">' +
                'primary <input type="checkbox" class="additional" data-id="' + i + '" data-type="P"/> ' +
                'unique <input type="checkbox" class="additional" data-id="' + i + '" data-type="U"/> ' +
                'not null <input type="checkbox" class="additional" data-id="' + i + '" data-type="NN"/> ' +
                'auto increment <input type="checkbox" class="additional" data-id="' + i + '" data-type="AI"/> ' +
                'FK <input type="checkbox" class="additional" data-id="' + i + '" data-type="FK"/> ';
            if (fields[i].type === "VARCHAR") {
                tmp += '<input type="number" class="length" maxlength="4" data-id="' + i + '" value="' + DEFAULT_VARCHAR_LEN +'"/> ';
            }
            tmp += '</div></div>';
            html += tmp;
        }
        output.html(html);
        finalOutput();
    });

    $(document).on('change', '.length', function () {
        console.log(fields);
        let id = $(this).data('id');
        console.log(id);
        let val = $(this).val();
        fields[id].length = val;

        finalOutput();
    });

    $(document).on('change', '.additional', function () {
        let id = $(this).data('id');
        let type = $(this).data('type');
        switch(type) {
            case 'P':
                fields[id].primary = $(this).prop('checked');
                break;
            case 'U':
                fields[id].unique = $(this).prop('checked');
                break;
            case 'NN':
                fields[id].not_null = $(this).prop('checked');
                break;
            case 'AI':
                fields[id].auto_increment = $(this).prop('checked');
                break;
            case 'FK':
                fields[id].foreign_key = $(this).prop('checked');
                break;
        }
        finalOutput();
    });

    function finalOutput() {
        let tblName = name.val().length > 0 ? name.val() : "INVALID_TABLE_NAME";
        let pk = "";
        let fk = "";
        let f = "";

        let output = "CREATE TABLE " + tblName + "(\n";
        for(let i = 0; i < fields.length - 1; i++) {
            f += "\t" + fields[i].name;
            if(fields[i].type === "VARCHAR") {
                f += " VARCHAR(" + fields[i].length + ")";
            } else {
                f += ' ' + fields[i].type.toUpperCase();
            }
            if(fields[i].unique) {
                f += " UNIQUE";
            }
            if(fields[i].not_null) {
                f += " NOT NULL";
            }
            if(fields[i].auto_increment) {
                f += " AUTO_INCREMENT";
            }
            f += ",\n";

            if(fields[i].primary) {
                pk += "\tPRIMARY KEY (" + fields[i].name + "),\n";
            }
            if(fields[i].foreign_key) {
                fk += "\tFOREIGN KEY(" + fields[i].name + ") REFERENCES tbl(col),\n";
            }
        }

        if(fields.length > 0) {
            let i = fields.length - 1;
            f += "\t" + fields[i].name;
            if(fields[i].type === "VARCHAR") {
                f += " VARCHAR(" + fields[i].length + ")";
            } else {
                f += ' ' + fields[i].type.toUpperCase();
            }
            if(fields[i].unique) {
                f += " UNIQUE";
            }
            if(fields[i].not_null) {
                f += " NOT NULL";
            }
            if(fields[i].auto_increment) {
                f += " AUTO_INCREMENT";
            }

            if(fields[i].primary) {
                pk += "PRIMARY KEY (" + fields[i].name + "),\n";
            }
            if(fields[i].foreign_key) {
                fk += "FOREIGN KEY(" + fields[i].name + ") REFERENCES tbl(col),\n";
            }

            if(pk.length === 0 && fk.length === 0) {
                f += "\n";
            } else {
                f += ",\n";
            }
        }
        if(pk.charAt(pk.length-2) === ',' && fk.length === 0) {
            pk = pk.slice(0, pk.length-2);
        }
        if(fk.charAt(fk.length-2) === ',') {
            fk = fk.slice(0, fk.length-2);
        }

        output += f + pk + fk;
        output += "\n);";
        finalOut.html('<textarea>' + output + '</textarea>')
    }
});

function charToSQLType(c) {
    var val = '';
    switch (c.toLowerCase()) {
        case 'i':
            val = 'INT';
            break;
        case 's':
            val = 'VARCHAR';
            break;
        case 'd':
            val = 'DATETIME';
            break;
        case 't':
            val = 'TIMESTAMP';
            break;
        case 'b':
            val = 'TINYINT';
            break;
        default:
            val = c.toUpperCase() + ' IS NOT A VALID TYPE';
            break;
    }
    return val;
}

function clearArray(array) {
    while (array.length) {
        array.pop();
    }
}

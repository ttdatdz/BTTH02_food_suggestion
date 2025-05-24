% 1. Dinh nghia cac cong thuc mon an co ban
recipe('Trung Chien', ['trung', 'hanh']).
recipe('Pho Bo', ['thit bo', 'banh pho', 'rau thom', 'hanh', 'que']).
recipe('Com Chien', ['com', 'trung', 'hanh', 'ca rot']).
recipe('Ga Ran', ['thit ga', 'bot']).

% 2. Bo sung cac mon an phuc tap hon
recipe('Lau Hai San', ['tom', 'muc', 'cua', 'rau thom', 'sa', 'la chanh']).
recipe('Banh Mi Xiu Mai', ['banh mi', 'thit heo', 'hanh', 'tuong ot']).
recipe('Ga Nuong Mat Ong', ['thit ga', 'mat ong', 'toi', 'nuoc mam']).
recipe('Com Ga Hoi An', ['com', 'thit ga', 'rau thom', 'nuoc mam', 'toi']).
recipe('Bun Bo Hue', ['bun', 'thit bo', 'gio heo', 'xuong bo', 'sa', 'ot']).

% 3. Luat thay the nguyen lieu
replacement('thit ga', 'thit bo').
replacement('thit heo', 'thit bo').
replacement('nuoc mam', 'tuong').
replacement('banh pho', 'bun').
replacement('ca rot', 'cu cai trang').
replacement('mat ong', 'duong').

% 4. Thay the gia vi
replacement('hanh', 'hanh la').
replacement('toi', 'hanh toi').
replacement('ot', 'ot kho').
replacement('rau thom', 'hung que').

% 5. Cac luat xu ly logic
ingredient_available(Ingredient, Ingredients) :-
    member(Ingredient, Ingredients).
ingredient_available(Ingredient, Ingredients) :-
    replacement(Ingredient, Alternative),
    member(Alternative, Ingredients).

all_ingredients_available([], _).
all_ingredients_available([H|T], Ingredients) :-
    ingredient_available(H, Ingredients),
    all_ingredients_available(T, Ingredients).

% 6. Format output
format_recipe_output(Recipe-Ingredients, Formatted) :-
    atomic_list_concat(Ingredients, ',', IngredientsStr),
    format(atom(Formatted), "'~w'-[~w]", [Recipe, IngredientsStr]).

% 7. Goi y mon an kem nguyen lieu
suggest_recipe_with_ingredients(Ingredients, Recipe-Required) :-
    recipe(Recipe, Required),
    all_ingredients_available(Required, Ingredients).

% 8. Danh gia do uu tien cua mon an
recipe_priority(Recipe, Priority) :-
    recipe(Recipe, Ingredients),
    length(Ingredients, Len),
    Priority is 1 / Len.

% 9. Goi y mon an co sap xep uu tien
suggest_recipe_with_priority(Ingredients, Recipe) :-
    findall(R-P, (
        suggest_recipe_with_ingredients(Ingredients, R-_),
        recipe_priority(R, P)
    ), Recipes),
    sort(1, @>=, Recipes, Sorted),
    member(Recipe-_, Sorted).
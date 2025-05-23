% recipes.pl - Phiên bản đã hoàn thiện các yêu cầu

% 1. Dinh nghia cac cong thuc mon an co ban (da co)
recipe('Trung Chien', ['trung', 'hanh']).
recipe('Pho Bo', ['thit bo', 'banh pho', 'rau thom', 'hanh', 'que']).
recipe('Com Chien', ['com', 'trung', 'hanh', 'ca rot']).
recipe('Ga Ran', ['thit ga', 'bot']).


% 2. Bo sung cac mon an phuc tap hon (yeu cau lam them)
recipe('Lau Hai San', ['tom', 'muc', 'cua', 'rau thom', 'sa', 'la chanh']).
recipe('Banh Mi Xiu Mai', ['banh mi', 'thit heo', 'hanh', 'tuong ot']).
recipe('Ga Nuong Mat Ong', ['thit ga', 'mat ong', 'toi', 'nuoc mam']).
recipe('Com Ga Hoi An', ['com', 'thit ga', 'rau thom', 'nuoc mam', 'toi']).
recipe('Bun Bo Hue', ['bun', 'thit bo', 'gio heo', 'xuong bo', 'sa', 'ot']).

% 3. Luat thay the nguyen lieu (da co va bo sung them)
replacement('thit ga', 'thit bo').
replacement('thit heo', 'thit bo').
replacement('nuoc mam', 'tuong').
replacement('banh pho', 'bun').
replacement('ca rot', 'cu cai trang').
replacement('mat ong', 'duong').

% 4. Thay the gia vi (yeu cau lam them)
replacement('hanh', 'hanh la').
replacement('toi', 'hanh toi').
replacement('ot', 'ot kho').
replacement('rau thom', 'hung que').

% 5. Cac luat xu ly logic (giu nguyen)
ingredient_available(Ingredient, Ingredients) :-
    member(Ingredient, Ingredients).
ingredient_available(Ingredient, Ingredients) :-
    replacement(Ingredient, Alternative),
    member(Alternative, Ingredients).

all_ingredients_available([], _).
all_ingredients_available([H|T], Ingredients) :-
    ingredient_available(H, Ingredients),
    all_ingredients_available(T, Ingredients).

suggest_recipe(Ingredients, Recipe) :-
    recipe(Recipe, Required),
    all_ingredients_available(Required, Ingredients).

% 6. Bo sung them luat danh gia su phu hop
recipe_priority(Recipe, Priority) :-
    recipe(Recipe, Ingredients),
    length(Ingredients, Len),
    Priority is 1/Len. % Món ít nguyên liệu có độ ưu tiên cao hơn

% Goi y mon an co sap xep uu tien
suggest_recipe_with_priority(Ingredients, Recipe) :-
    findall(R-P, (suggest_recipe(Ingredients, R), recipe_priority(R, P)), Recipes),
    sort(1, @>=, Recipes, Sorted),
    member(Recipe-_, Sorted).
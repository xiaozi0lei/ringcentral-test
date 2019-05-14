import { Selector } from 'testcafe';

fixture`Todo MVC Test`
    .page`http://todomvc.com/examples/react/`
    .beforeEach(async t => {
        /* test initialization code */
        clearToDo(t);
    });

test('Add an entry', async t => {
    const todoExistFlag = Selector('span.todo-count').exists;
    await t.expect(todoExistFlag).notOk('items not empty, error in before hook');

    const todoCount = Selector('span.todo-count strong').innerText;
    await t
        .typeText('.new-todo', 'John Smith')
        .pressKey('enter')
        .expect(todoCount).eql('1');
});

test
    .before(async t => {
        addTwoEntries(t);
    })
    ('delete an entry', async t => {
        const checkbox1 = Selector('ul.todo-list > li:nth-child(1) > div > input.toggle');
        const deleteButton = Selector('ul.todo-list > li:nth-child(1) > div > button.destroy');
        const todoCount1 = Selector('span.todo-count strong').innerText;
        await t
            .hover(checkbox1)
            .click(deleteButton)
            .expect(todoCount1).eql('1');
    });

test
    .before(async t => {
        addTwoEntries(t);
    })
    ('set status to completed', async t => {
        const checkbox1 = Selector('ul.todo-list > li:nth-child(1) > div > input.toggle');
        const completedAll = Selector("a[href='#/completed']");
        const todoCount1 = Selector('span.todo-count strong').innerText;
        await t
            .click(checkbox1)
            .expect(todoCount1).eql('1');
        await t
            .click(completedAll)
            .expect(todoCount1).eql('1');
    })
    .after(async t => {
        /* test finalization code */
        clearToDo(t);
    });

function clearToDo(t) {
    const todoExist = await Selector('.toggle-all').exists;
    if (todoExist) {
        const selectAllLabel = Selector('label[for=toggle-all]');
        await t.click(selectAllLabel);
        const completedAll = Selector("a[href='#/completed']");
        await t.click(completedAll);
        const buttonClearCompleted = Selector("button.clear-completed");
        await t.click(buttonClearCompleted);
    }
}

function addTwoEntries(t) {
    const todoExistFlag = Selector('span.todo-count').exists;
    await t.expect(todoExistFlag).notOk('items not empty, error in before hook');

    const todoCount = Selector('span.todo-count strong').innerText;
    for (var i = 0; i < 2; i++) {
        var result = i + 1;
        await t
            .typeText('.new-todo', 'John Smith' + i)
            .pressKey('enter')
            .expect(todoCount).eql(result.toString());
    }
}
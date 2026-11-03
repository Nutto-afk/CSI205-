"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/tailgrids/core/button";
import { Toggle } from "@/components/tailgrids/core/toggle";
import { Check, ClockThree, Plus, Trash1 } from "@tailgrids/icons";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/tailgrids/core/native-select";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/components/tailgrids/core/table";

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/tailgrids/core/dialog";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { Backdrop } from "@/components/tailgrids/core/overlay";
import { TextField } from "@/components/tailgrids/core/text-field";

import { Pagination } from "@/components/tailgrids/core/pagination";
import { Spinner } from "@/components/tailgrids/core/spinner";

import { fetchTodos, type TodoType } from "@/data/todos";
type Todo = TodoType;

export default function TodosPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [todosRaw, setTodosRaw] = useState<TodoType[]>([]);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [onlyWaiting, setOnlyWaiting] = useState<boolean>(false);
  const [itemPerpage, setItemPerpage] = useState<number>(5);

  const [showDialog, setShowDialog] = useState<boolean>(false);

  useEffect(() => {
    fetchTodos()
      .then((data) => {
        setTodosRaw(data as TodoType[]);
      })
      .catch(() => {
        setTodosRaw([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (onlyWaiting) {
      const remain = todosRaw.filter((todo) => {
        return todo.completed == false;
      });

      setTodos(remain);
    } else {
      setTodos(todosRaw);
    }
  }, [todosRaw, onlyWaiting]);

  useEffect(() => {
    setTotalPages(Math.ceil(todos.length / itemPerpage));
  }, [todos, itemPerpage]);

  useEffect(() => {
    if (totalPages > 0) {
      if (currentPage <= 0) {
        setCurrentPage(1);
      } else if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }
  }, [totalPages, currentPage]);

  //delete
  const deleteTodo = (id: number) => {
    ///filter
    const remain = todosRaw.filter((todo) => {
      return todo.id !== id;
    });
    /// update to todosRaw
    setTodosRaw(remain);
  };

  //make done
  const makeDone = (id: number) => {
    console.log(`make done ${id}`);
    const selected = todosRaw.find((todo) => {
      return todo.id == id;
    });
    /// edit
    selected!.completed = true;
    console.log(selected);
    //update status
    setTodosRaw([...todosRaw]);
  };

  //add todo
  const addTodo = () => {
    console.log("add todo  ...");
    const idDom = document.getElementById("id") as HTMLInputElement;
    const titleDom = document.getElementById("title") as HTMLInputElement;

    if (!titleDom) return;
    /// validate
    const titleStr = titleDom.value.trim();
    if (titleStr == "") return;

    const nextId = idDom
      ? Number(idDom.value)
      : todosRaw.reduce((p, t) => (t.id > p ? t.id : p), 0) + 1;

    const newTodo: Todo = {
      userId: 1,
      id: nextId,
      title: titleStr,
      completed: false,
    };
    /// add to todoRaw
    setTodosRaw([...todosRaw, newTodo]);

    titleDom.value = "";
    setShowDialog(false);
  };

  return (
    <>
      <div className="w-[640px] max-w-full mx-auto mt-6 px-4">
        {/* todos container */}
        {/* controller */}
        <div className="flex justify-between items-center mb-4 gap-4">
          {/* toggle */}
          <div className="flex items-center gap-2">
            <Toggle
              label="Show only"
              checked={onlyWaiting}
              onChange={(e) => setOnlyWaiting(e.target.checked)}
            />
            <button className="h-7 px-2.5 bg-yellow-400 text-neutral-900 rounded-md pointer-events-none text-xs font-semibold flex items-center gap-1 shadow-xs">
              Waiting <ClockThree size={14} />
            </button>
          </div>
          {/* dropdown */}
          <div className="w-44">
            <NativeSelect
              placeholder="Select an option"
              value={itemPerpage}
              onChange={(e) => {
                setItemPerpage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <NativeSelectOption value="5">
                5 Items per page
              </NativeSelectOption>
              <NativeSelectOption value="10">
                10 Items per page
              </NativeSelectOption>
              <NativeSelectOption value="50">
                50 Items per page
              </NativeSelectOption>
            </NativeSelect>
          </div>
        </div>

        {/* table */}
        <div className="rounded-xl border border-neutral-200 overflow-hidden shadow-xs bg-white">
          <TableRoot>
            <TableHeader>
              <TableRow className="bg-black text-white font-bold [&>th]:text-white [&>th]:border-neutral-800">
                <TableHead scope="col" className="w-16 text-center">
                  ID
                </TableHead>
                <TableHead scope="col" className="pl-4 text-center">
                  Title
                </TableHead>
                <TableHead scope="col" className="w-48 pr-4">
                  <div className="flex items-center justify-end gap-2">
                    <span>Status</span>
                    <Button
                      size="xs"
                      variant="primary"
                      iconOnly
                      className="size-7 rounded-md"
                      onClick={() => setShowDialog(true)}
                    >
                      <Plus color="white" size={14} />
                    </Button>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* show spinner while loading */}
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <div className="flex justify-center items-center gap-2 text-neutral-500">
                      <Spinner size="md" />
                      <span>Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : todos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-neutral-400 font-medium"
                  >
                    No todos found
                  </TableCell>
                </TableRow>
              ) : (
                todos
                  .filter((todo, index) => {
                    const lower = (currentPage - 1) * itemPerpage;
                    const upper = currentPage * itemPerpage - 1;
                    return index >= lower && index <= upper;
                  })
                  .map((todo) => (
                    <TableRow
                      key={todo.id}
                      className="hover:bg-neutral-50/80 transition-colors"
                    >
                      <TableCell className="w-16 text-center font-medium text-neutral-500 py-3">
                        {todo.id}
                      </TableCell>
                      <TableCell className="pl-4 py-3 font-medium text-neutral-800">
                        {todo.title}
                      </TableCell>
                      <TableCell className="w-48 pr-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {todo.completed ? (
                            <Button
                              variant="primary"
                              size="xs"
                              className="w-[88px] justify-center gap-1 shadow-xs"
                            >
                              Done <Check size={14} />
                            </Button>
                          ) : (
                            <Button
                              size="xs"
                              className="w-[88px] justify-center bg-amber-500 hover:bg-amber-600 text-white gap-1 shadow-xs"
                              onClick={() => makeDone(todo.id)}
                            >
                              Waiting <ClockThree size={14} />
                            </Button>
                          )}
                          <Button
                            variant="danger"
                            size="xs"
                            iconOnly
                            aria-label="Delete"
                            className="size-7 shrink-0 shadow-xs"
                            onClick={() => deleteTodo(todo.id)}
                          >
                            <Trash1 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </TableRoot>
        </div>

        {/* pagination */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <Button
            size="sm"
            appearance="outline"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage <= 1}
            className="h-10 px-3.5"
          >
            First
          </Button>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            sideLayout="icon"
            onPageChange={(page) => setCurrentPage(page)}
          />
          <Button
            size="sm"
            appearance="outline"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage >= totalPages}
            className="h-10 px-3.5"
          >
            Last
          </Button>
        </div>
      </div>

      <Backdrop isOpen={showDialog} onOpenChange={setShowDialog}>
        <Dialog>
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl gap-2">
              <Plus className="bg-blue-100 rounded-md" size={32} /> Add Todo
            </DialogTitle>
          </DialogHeader>

          <DialogBody>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                addTodo();
              }}
            >
              <TextField className="flex flex-col gap-1.5">
                <Label>ID (auto)</Label>
                <Input
                  id="id"
                  readOnly
                  className="font-normal w-full pointer-events-none bg-gray-100 text-gray-400"
                  value={
                    todosRaw.reduce((p, t) => (t.id > p ? t.id : p), 0) + 1
                  }
                />
              </TextField>

              <TextField className="flex flex-col gap-1.5">
                <Label className="font-bold">Title</Label>
                <Input
                  autoFocus
                  placeholder="Enter things to do"
                  className="w-full"
                  id="title"
                />
              </TextField>
            </form>
          </DialogBody>

          <DialogFooter>
            <DialogClose appearance="outline">Cancel</DialogClose>
            <DialogClose onClick={() => addTodo()}>Add todo</DialogClose>
          </DialogFooter>
        </Dialog>
      </Backdrop>
    </>
  );
}

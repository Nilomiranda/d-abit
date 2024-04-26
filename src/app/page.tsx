'use client'

import {useState} from "react";

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;

interface HabitEntity {
  name: string;
  /**
   * Hex code string
   */
  color: string;

  daysCompleted: string[];
}

type HabitInput = {
  name: string;
  day: number;
  month: number;
  year: number;
}

const getMonthMetaData = (monthNumber: number) => {
  const monthMap = [
    { number: 1, name: 'January', days: new Date(currentYear, 1, 0).getDate() },
    { number: 2, name: 'February', days: new Date(currentYear, 2, 0).getDate() },
    { number: 3, name: 'March', days: new Date(currentYear, 3, 0).getDate() },
    { number: 4, name: 'April', days: new Date(currentYear, 4, 0).getDate() },
    { number: 5, name: 'May', days: new Date(currentYear, 5, 0).getDate() },
    { number: 6, name: 'June', days: new Date(currentYear, 6, 0).getDate() },
    { number: 7, name: 'July', days: new Date(currentYear, 7, 0).getDate() },
    { number: 8, name: 'August', days: new Date(currentYear, 8, 0).getDate() },
    { number: 9, name: 'September', days: new Date(currentYear, 9, 0).getDate() },
    { number: 10, name: 'October', days: new Date(currentYear, 10, 0).getDate() },
    { number: 11, name: 'November', days: new Date(currentYear, 11, 0).getDate() },
    { number: 12, name: 'December', days: new Date(currentYear, 12, 0).getDate() },
  ]

  return monthMap.find(month => month.number === monthNumber)
}

const isHabitLogged = (currentHabitsList: HabitEntity[], { name, day, month, year }: HabitInput) => {
  const habitRegistry = `${year}/${month}/${day}`;
  const foundHabit = currentHabitsList.find(currentHabit => currentHabit.name === name)
  const { daysCompleted: habitCompletedDays } = foundHabit!;

  return habitCompletedDays.includes(habitRegistry)
}

const getSavedHabits = () => {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('HABITS_LIST') || '[]')
  }

  return []
}

export default function Home() {
  const [habits, setHabits] = useState<HabitEntity[]>(getSavedHabits)
  const [currentMonthNumber, setCurrentMonthNumber] = useState<number>(currentMonth)

  const initialColor = Math.floor(Math.random()*16777215).toString(16);

  const updateList = (updatedHabitsList: HabitEntity[]) => {
    localStorage.setItem('HABITS_LIST', JSON.stringify(updatedHabitsList))
    setHabits(updatedHabitsList)
  }

  const handleSubmit = (formData: FormData) => {
    const name = formData.get('name')
    const color = formData.get('color') // hex code

    if (!name) {
      return alert('Missing is required.')
    }

    const newHabit: HabitEntity = { name: String(name), color: String(color), daysCompleted: [] }

    const newHabitsList: HabitEntity[] = [...habits, newHabit];

    updateList(newHabitsList)
  }

  const handleMonthChangeClick = (desiredMonth: number) => {
    let newMonth = desiredMonth;
    if (newMonth < 1) {
      newMonth = 12;
    }
    if (newMonth > 12) {
      newMonth = 1;
    }
    setCurrentMonthNumber(newMonth)
  }

  const days = (month: number): number[] => Array.from({ length: getMonthMetaData(month)!.days }, (_, i) => i+1);

  const handleHabitToggle = ({ day, month, year, name }: HabitInput) => {
    const updatedHabits = habits.map(habit => {
      const isTargetHabit = habit.name === name;

      const habitRegistry = `${year}/${month}/${day}`;

      if (isTargetHabit) {
        const previouslyLoggedIndex = habit.daysCompleted.findIndex(completedDay => completedDay === habitRegistry)
        const wasHabitPreviouslyLogged = previouslyLoggedIndex > -1;
        if (wasHabitPreviouslyLogged) {
           habit.daysCompleted.splice(previouslyLoggedIndex, 1);
        } else {
          habit.daysCompleted.push(habitRegistry)
        }
      }

      return habit;
    })

    updateList(updatedHabits)
  }

  const currentMonthName = getMonthMetaData(currentMonthNumber)?.name;

  return (
    <main className="px-4 py-6">
      <h1 className="text-4xl font-bold">Habit tracker</h1>

      <div className="flex items-center gap-x-6 mb-10">
        <button onClick={() => handleMonthChangeClick(currentMonthNumber - 1)}>Previous Month</button>

        <span>{currentMonthName}</span>

        <button onClick={() => handleMonthChangeClick(currentMonthNumber + 1)}>Next Month</button>
      </div>

      <div className="flex flex-col gap-y-6 border border-solid border-gray-300 px-4 py-2 mb-10">
        <h2>Insert habit</h2>

        <form className="flex flex-col gap-y-4" action={handleSubmit}>
          <label className="form-field">
            <span>Habit name</span>
            <input required name="name" type="text" placeholder="Ex.: Gym"/>
          </label>

          <label className="form-field">
            <span>Color</span>
            <input defaultValue={`#${initialColor}`} name="color" type="color"/>
          </label>

          <button className="border-2 border-gray-100 border-solid w-fit" type="submit">Save</button>
        </form>
      </div>

      <div>
        <h2 className="mb-4">Current tracking</h2>

        {
          !habits.length ?
            <p>No habits being tracked</p> :
            (
              <ul className="flex flex-col gap-y-4">
                {
                  habits.map((habit, index) => (
                    <li key={index} className="flex flex-col gap-y-2">
                      {habit.name}
                      <div className="flex items-center gap-x-2 overflow-x-scroll max-w-screen-4xl">
                        {
                          days(currentMonthNumber).map(day => {
                            const isLogged = isHabitLogged(habits, {
                              day,
                              month: currentMonthNumber,
                              year: currentYear,
                              name: habit.name,
                            })
                            return (
                              <button
                                onClick={() => handleHabitToggle({
                                  day,
                                  month: currentMonthNumber,
                                  year: currentYear,
                                  name: habit.name,
                                })}
                                style={{borderColor: habit.color, backgroundColor: isLogged ? habit.color : 'unset'}}
                                className="flex flex-col items-center px-4 py-2 border-2 border-solid"
                                key={day}
                              >
                                <span>{currentMonthName}</span>
                                <span>{day}</span>
                              </button>
                            )
                          })
                        }
                      </div>
                    </li>
                  ))
                }
              </ul>
            )
        }
      </div>
    </main>
  );
}

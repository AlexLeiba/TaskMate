import { Spacer } from '@/components/ui/spacer';
import React from 'react';

function About() {
  return (
    <div className='max-w-screen-2xl mx-auto pt-24 dark:text-white'>
      <div>
        <div>
          <h3 className='sm:text-6xl'>About</h3>
          <Spacer size={8} md={4} sm={4} />
          <div>
            <div>
              <section>
                <p>TaskMate is a friendly and easy to use task manager app</p>
              </section>
            </div>

            <div>
              <Spacer sm={4} />

              <section>
                <h5>Features</h5>
                <ul>
                  <li>
                    <p className='font-bold'>Authentication</p>
                    <p>
                      • Authentication with Google / Github / Email / Facebook
                    </p>
                  </li>
                  <Spacer sm={2} />
                  <li>
                    <p className='font-bold'>Organization</p>
                    <p>
                      • Manage multiple organizations: create, update, delete
                    </p>
                    <p>• Members: invite , delete , change permissions</p>
                  </li>
                  <Spacer sm={2} />
                  <li>
                    <p className='font-bold'>Board</p>
                    <p>• Manage boards: create, update, delete</p>
                    <p>• Select background image for each board</p>
                  </li>
                  <Spacer sm={2} />
                  <li>
                    <p className='font-bold'>Lists / Column</p>
                    <p>
                      • Manage lists/columns : create , update , delete , copy ,
                      status
                    </p>
                    <p>
                      • DRAG AND DROP: drag and drop functionality to move lists
                      between other lists in the same board.
                    </p>
                  </li>
                  <Spacer sm={2} />
                  <li>
                    <p className='font-bold'>Cards / Tickets</p>
                    <p>
                      • Manage cards/tickets : create, update, delete , copy ,
                      add priority , assign to a member
                    </p>
                    <p>
                      • DRAG AND DROP: drag and drop functionality to move
                      cards/tickets between the same or other lists/columns .
                    </p>
                    <p>• Card/Ticket details: title , description</p>
                  </li>
                </ul>
              </section>
            </div>
            <div>
              <Spacer sm={6} />

              <section>
                <h5>Technologies used</h5>

                <div className='flex gap-8'>
                  <div>
                    <p className=' font-bold '>Front-end</p>
                    <ul>
                      <li>
                        <p>Next.js</p>
                      </li>
                      <li>
                        <p>React.js</p>
                      </li>
                      <li>
                        <p>Tailwind CSS</p>
                      </li>

                      <li>
                        <p>React-hook-form</p>
                      </li>

                      <li>
                        <p>zod</p>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className=' font-bold '>Back-end</p>
                    <ul>
                      <li>
                        <p>Database PostgreSQL </p>
                      </li>
                      <li>
                        <p>Prisma</p>
                      </li>
                      <li>
                        <p>Clerk</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

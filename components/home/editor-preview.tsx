import { MoreHorizontal } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export function EditorPreview() {
  return (
    <div className="flex h-full flex-col gap-4 text-xs font-geist-mono sm:text-xs">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-muted-foreground">VendingMachine.ts</span>
      </div>

      <div className="space-y-1 leading-6">
        <p>
          Encapsulate the vending machine state using private fields and expose only the operations
          needed to interact with it.
        </p>

        <CodeLine>
          <Keyword>class</Keyword> VendingMachine {'{'}
        </CodeLine>

        <CodeLine indent>
          <Keyword>private</Keyword> <Muted>inventory:</Muted> Inventory;
        </CodeLine>

        <CodeLine indent>
          <Keyword>private</Keyword> <Muted>state:</Muted> VendingState;
        </CodeLine>

        <CodeLine>{'}'}</CodeLine>
      </div>

      <div className="mt-auto flex items-center gap-2 border-t border-border py-2 text-xs text-muted-foreground">
        <HugeiconsIcon icon={MoreHorizontal} size={16} />
        Design in progress
      </div>
    </div>
  );
}

function CodeLine({
  children,
  indent = 0,
}: {
  children: React.ReactNode;
  indent?: number | boolean;
}) {
  const level = typeof indent === 'boolean' ? (indent ? 1 : 0) : indent;

  return (
    <p style={{ paddingLeft: `${level * 16}px` }}>
      <span className="mr-4 inline-block w-3 select-none text-muted-foreground/40">
        {level + 1}
      </span>
      {children}
    </p>
  );
}

function Keyword({ children }: { children: React.ReactNode }) {
  return <span className="text-primary">{children}</span>;
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}

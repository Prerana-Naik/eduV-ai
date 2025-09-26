import {
  ThreadPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ErrorPrimitive,
} from "@assistant-ui/react";
import { useState, useEffect, type FC } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  CopyIcon,
  CheckIcon,
  PencilIcon,
  RefreshCwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Square,
  SendHorizontalIcon,
} from "lucide-react";

import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MarkdownText } from "./markdown-text";
import { ToolFallback } from "./tool-fallback";

// User Profile Type
type UserProfile = {
  name: string;
  role: string;
  age: number | string;
  subject: string;
  chatStyle: string;
  qualification?: string;
  email?: string;
};

// Utility functions for per-user message storage
const getMessagesKey = (email: string) => `assistant_messages_${email}`;

export const saveMessage = (email: string, msg: any) => {
  const key = getMessagesKey(email);
  const messages = JSON.parse(localStorage.getItem(key) || "[]");
  messages.push(msg);
  localStorage.setItem(key, JSON.stringify(messages));
};

export const loadMessages = (email: string) => {
  const key = getMessagesKey(email);
  return JSON.parse(localStorage.getItem(key) || "[]");
};

type ThreadProps = {
  userEmail?: string;
  userRole?: string;
  variant?: "modern" | "classic";
  userProfile?: UserProfile | null;
};

export const Thread: FC<ThreadProps> = ({ 
  userEmail = "guest@example.com", 
  userRole = "student",
  variant = "modern",
  userProfile = null
}) => {
  const bgColor = variant === "modern" ? "bg-[#f7f6f3]" : "bg-background";
  
  return (
    <ThreadPrimitive.Root
      className={`${bgColor} box-border flex h-full flex-col overflow-hidden`}
      style={{
        ["--thread-max-width" as string]: "42rem",
      }}
    >
      <ThreadPrimitive.Viewport
        className={`flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8 ${
          variant === "modern" 
            ? "scrollbar-color-[#bfc8d0_#f7f6f3] scrollbar-thin"
            : ""
        }`}
        style={variant === "modern" ? {
          scrollbarColor: "#bfc8d0 #f7f6f3",
          scrollbarWidth: "thin",
        } : {}}
      >
        <ThreadWelcome variant={variant} userRole={userRole} userProfile={userProfile} />
<ThreadPrimitive.Messages
  components={{
    UserMessage: (props) => <UserMessage {...props} variant={variant} />,
    EditComposer: (props) => <EditComposer {...props} variant={variant} />,
    AssistantMessage: (props) => <AssistantMessage {...props} variant={variant} userProfile={userProfile} />,
  }}
/>

        <ThreadPrimitive.If empty={false}>
          <div className="min-h-8 flex-grow" />
        </ThreadPrimitive.If>

        <div className="sticky bottom-0 mt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
          <ThreadScrollToBottom variant={variant} />
          <Composer userRole={userRole} variant={variant} userProfile={userProfile} />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC<{ variant?: "modern" | "classic" }> = ({ variant = "modern" }) => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className={
          variant === "modern"
            ? "dark:bg-background dark:hover:bg-accent absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible"
            : "absolute -top-8 rounded-full disabled:invisible"
        }
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC<{ 
  variant?: "modern" | "classic"; 
  userRole?: string;
  userProfile?: UserProfile | null;
}> = ({ 
  variant = "modern", 
  userRole = "student",
  userProfile = null
}) => {
  // Use profile name if available
  const userName = userProfile?.name || "there";
  
  return (
    <ThreadPrimitive.Empty>
      <div className="mx-auto flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col px-[var(--thread-padding-x)]">
        <div className="flex w-full flex-grow flex-col items-center justify-center">
          {variant === "modern" ? (
            <div className="flex size-full flex-col justify-center px-8 md:mt-20">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-semibold"
              >
                Hello {userName}!
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground/65 text-xxl"
              >
                {userProfile?.role === "teacher" 
                  ? "What would you like to create today?"
                  :""
                }
              </motion.div>
              {userProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.7 }}
                  className="text-muted-foreground/50 text-sm mt-2"
                >
                  I'm ready to help with {userProfile.subject} in a {userProfile?.chatStyle?.toLowerCase() || 'friendly'} style..
                </motion.div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="mt-4 font-medium text-lg">
                Hello {userName}! How can I help you today?
              </p>
              {userProfile && (
                <p className="text-muted-foreground text-sm mt-2">
                  Ready to assist with {userProfile.subject}
                </p>
              )}
            </div>
          )}
        </div>
        <ThreadWelcomeSuggestions 
          role={userRole} 
          variant={variant} 
          userProfile={userProfile}
        />
      </div>
    </ThreadPrimitive.Empty>
  );
};

const getSuggestionsForRole = (role: string, userProfile?: UserProfile | null) => {
  if (role === "teacher") {
    const subject = userProfile?.subject || "your subject";
    return [
      {
        title: "Create a quiz",
        label: `for ${subject}`,
        action: `Generate a quiz for ${subject} students that's engaging and educational.`,
      },
      {
        title: "Lesson plan ideas",
        label: `for teaching ${subject}`,
        action: `Suggest creative lesson plan ideas for teaching ${subject} concepts.`,
      },
      {
        title: "Student assessment",
        label: "methods and rubrics",
        action: `Help me create assessment methods and rubrics for ${subject}.`,
      },
      {
        title: "Classroom management",
        label: "tips and strategies",
        action: "Give me effective classroom management tips and engagement strategies.",
      },
    ];
  }
  
  // Student suggestions based on profile
  const subject = userProfile?.subject || "your studies";
  const age = userProfile?.age;
  const ageText = age ? ` suitable for age ${age}` : "";
  
  return [
    {
      title: `Explain ${subject}`,
      label: "in simple terms",
      action: `Can you explain key concepts in ${subject} in simple terms${ageText}?`,
    },
    {
      title: "Help with homework",
      label: `${subject} problems`,
      action: `Can you help me understand and solve my ${subject} homework problems?`,
    },
    {
      title: "Study techniques",
      label: `for ${subject}`,
      action: `What are the best study techniques for learning ${subject}${ageText}?`,
    },
    {
      title: "Practice questions",
      label: `test my knowledge`,
      action: `Give me practice questions to test my understanding of ${subject}${ageText}.`,
    },
  ];
};

const ThreadWelcomeSuggestions: FC<{ 
  role?: string; 
  variant?: "modern" | "classic";
  userProfile?: UserProfile | null;
}> = ({ role = "student", variant = "modern", userProfile = null }) => {
  const suggestions = getSuggestionsForRole(role, userProfile);

  if (variant === "classic") {
    return (
      <div className="mt-3 flex w-full items-stretch justify-center gap-4">
        {suggestions.slice(0, 2).map((suggestion, index) => (
          <ThreadPrimitive.Suggestion
            key={`classic-suggestion-${index}`}
            className="hover:bg-muted/80 flex max-w-sm grow basis-0 flex-col items-center justify-center rounded-lg border p-3 transition-colors ease-in"
            prompt={suggestion.action}
            method="replace"
            autoSend
          >
            <span className="line-clamp-2 text-ellipsis text-sm font-semibold">
              {suggestion.title}
            </span>
            <span className="line-clamp-1 text-ellipsis text-xs text-muted-foreground mt-1">
              {suggestion.label}
            </span>
          </ThreadPrimitive.Suggestion>
        ))}
      </div>
    );
  }

  return (
    <div className="grid w-full gap-2 sm:grid-cols-2">
      {suggestions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className="[&:nth-child(n+3)]:hidden sm:[&:nth-child(n+3)]:block"
        >
          <ThreadPrimitive.Suggestion
            prompt={suggestedAction.action}
            method="replace"
            autoSend
            asChild
          >
            <Button
              variant="ghost"
              className="dark:hover:bg-accent/60 h-auto w-full flex-1 flex-wrap items-start justify-start gap-1 rounded-xl border px-4 py-3.5 text-left text-sm sm:flex-col"
              aria-label={suggestedAction.action}
            >
              <span className="font-medium">{suggestedAction.title}</span>
              <p className="text-muted-foreground">{suggestedAction.label}</p>
            </Button>
          </ThreadPrimitive.Suggestion>
        </motion.div>
      ))}
    </div>
  );
};

const Composer: FC<{ 
  userRole?: string; 
  variant?: "modern" | "classic";
  userProfile?: UserProfile | null;
}> = ({ userRole = "student", variant = "modern", userProfile = null }) => {
  // Customize placeholder based on profile
  const placeholder = userProfile 
    ? `Ask me about ${userProfile.subject}...`
    : "Send a message...";

  if (variant === "classic") {
    return (
      <ComposerPrimitive.Root className="focus-within:border-ring/20 flex w-full flex-wrap items-end rounded-lg border bg-inherit px-2.5 shadow-sm transition-colors ease-in">
        <ComposerPrimitive.Input
          rows={1}
          autoFocus
          placeholder={placeholder}
          className="placeholder:text-muted-foreground max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
        />
        <ComposerAction variant="classic" />
      </ComposerPrimitive.Root>
    );
  }

  return (
    <div className="bg-background relative mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col gap-4 px-[var(--thread-padding-x)] pb-4 md:pb-6">
      <ComposerPrimitive.Root className="focus-within::ring-offset-2 relative flex w-full flex-col rounded-2xl focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white">
        <ComposerPrimitive.Input
          placeholder={placeholder}
          className="bg-muted border-border dark:border-muted-foreground/15 focus:outline-primary placeholder:text-muted-foreground max-h-[calc(50dvh)] min-h-16 w-full resize-none rounded-t-2xl border-x border-t px-4 pt-2 pb-3 text-base outline-none"
          rows={1}
          autoFocus
          aria-label="Message input"
        />
        <ComposerAction variant="modern" />
      </ComposerPrimitive.Root>
    </div>
  );
};

const ComposerAction: FC<{ variant?: "modern" | "classic" }> = ({ variant = "modern" }) => {
  if (variant === "classic") {
    return (
      <>
        <ThreadPrimitive.If running={false}>
          <ComposerPrimitive.Send asChild>
            <TooltipIconButton
              tooltip="Send"
              variant="default"
              className="my-2.5 size-8 p-2 transition-opacity ease-in"
            >
              <SendHorizontalIcon />
            </TooltipIconButton>
          </ComposerPrimitive.Send>
        </ThreadPrimitive.If>
        <ThreadPrimitive.If running>
          <ComposerPrimitive.Cancel asChild>
            <TooltipIconButton
              tooltip="Cancel"
              variant="default"
              className="my-2.5 size-8 p-2 transition-opacity ease-in"
            >
              <CircleStopIcon />
            </TooltipIconButton>
          </ComposerPrimitive.Cancel>
        </ThreadPrimitive.If>
      </>
    );
  }

  return (
    <div className="bg-muted border-border dark:border-muted-foreground/15 relative flex items-center justify-between rounded-b-2xl border-x border-b p-2">
      <TooltipIconButton
        tooltip="Attach file"
        variant="ghost"
        className="hover:bg-foreground/15 dark:hover:bg-background/50 scale-115 p-3.5"
        onClick={() => {
          console.log("Attachment clicked - not implemented");
        }}
      >
        <PlusIcon />
      </TooltipIconButton>

      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <Button
            type="submit"
            variant="default"
            className="dark:border-muted-foreground/90 border-muted-foreground/60 hover:bg-primary/75 size-8 rounded-full border"
            aria-label="Send message"
          >
            <ArrowUpIcon className="size-5" />
          </Button>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>

      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <Button
            type="button"
            variant="default"
            className="dark:border-muted-foreground/90 border-muted-foreground/60 hover:bg-primary/75 size-8 rounded-full border"
            aria-label="Stop generating"
          >
            <Square className="size-3.5 fill-white dark:size-4 dark:fill-black" />
          </Button>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </div>
  );
};

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="border-destructive bg-destructive/10 dark:bg-destructive/5 text-destructive mt-2 rounded-md border p-3 text-sm dark:text-red-200">
        <ErrorPrimitive.Message className="line-clamp-2" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
};

const AssistantMessage: FC<{ variant?: "modern" | "classic"; userProfile?: UserProfile | null }> = ({ 
  variant = "modern", 
  userProfile = null 
}) => {
  if (variant === "classic") {
    return (
      <MessagePrimitive.Root className="grid grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] relative w-full max-w-[var(--thread-max-width)] py-4">
        <div className="text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words leading-7 col-span-2 col-start-2 row-start-1 my-1.5">
          <MessagePrimitive.Content components={{ Text: MarkdownText }} />
          <MessageError />
        </div>

        <AssistantActionBar variant="classic" />

        <BranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
      </MessagePrimitive.Root>
    );
  }

  return (
    <MessagePrimitive.Root asChild>
      <motion.div
        className="relative mx-auto grid w-full max-w-[var(--thread-max-width)] grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] px-[var(--thread-padding-x)] py-4"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role="assistant"
      >
        <div className="ring-border bg-background col-start-1 row-start-1 flex size-8 shrink-0 items-center justify-center rounded-full ring-1">
          <StarIcon size={14} />
        </div>

        <div className="text-foreground col-span-2 col-start-2 row-start-1 ml-4 leading-7 break-words">
          <MessagePrimitive.Content
            components={{
              Text: MarkdownText,
              tools: { Fallback: ToolFallback },
            }}
          />
          <MessageError />
        </div>

        <AssistantActionBar variant="modern" />

        <BranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
      </motion.div>
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC<{ variant?: "modern" | "classic" }> = ({ variant = "modern" }) => {
  const className = variant === "modern"
    ? "text-muted-foreground data-floating:bg-background col-start-3 row-start-2 mt-3 ml-3 flex gap-1 data-floating:absolute data-floating:mt-2 data-floating:rounded-md data-floating:border data-floating:p-1 data-floating:shadow-sm"
    : "text-muted-foreground flex gap-1 col-start-3 row-start-2 -ml-1 data-[floating]:bg-background data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:p-1 data-[floating]:shadow-sm";

  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className={className}
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <MessagePrimitive.If copied>
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const UserMessage: FC<{ variant?: "modern" | "classic" }> = ({ variant = "modern" }) => {
  if (variant === "classic") {
    return (
      <MessagePrimitive.Root className="grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 [&:where(>*)]:col-start-2 w-full max-w-[var(--thread-max-width)] py-4">
        <UserActionBar variant="classic" />

        <div className="bg-muted text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words rounded-3xl px-5 py-2.5 col-start-2 row-start-2">
          <MessagePrimitive.Content />
        </div>

        <BranchPicker className="col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
      </MessagePrimitive.Root>
    );
  }

  return (
    <MessagePrimitive.Root asChild>
      <motion.div
        className="mx-auto grid w-full max-w-[var(--thread-max-width)] auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-1 px-[var(--thread-padding-x)] py-4 [&:where(>*)]:col-start-2"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role="user"
      >
        <UserActionBar variant="modern" />

        <div className="bg-muted text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words rounded-3xl px-5 py-2.5 col-start-2 row-start-2">
          <MessagePrimitive.Content />
        </div>

        <BranchPicker className="col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
      </motion.div>
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC<{ variant?: "modern" | "classic" }> = ({ variant = "modern" }) => {
  const className = variant === "modern"
    ? "col-start-1 mt-2.5 mr-3 flex flex-col items-end"
    : "flex flex-col items-end col-start-1 row-start-2 mr-3 mt-2.5";

  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className={className}
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC<{ variant?: "modern" | "classic" }> = ({ variant = "modern" }) => {
  if (variant === "classic") {
    return (
      <ComposerPrimitive.Root className="bg-muted my-4 flex w-full max-w-[var(--thread-max-width)] flex-col gap-2 rounded-xl">
        <ComposerPrimitive.Input className="text-foreground flex h-8 w-full resize-none bg-transparent p-4 pb-0 outline-none" />

        <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
          <ComposerPrimitive.Cancel asChild>
            <Button variant="ghost">Cancel</Button>
          </ComposerPrimitive.Cancel>
          <ComposerPrimitive.Send asChild>
            <Button>Send</Button>
          </ComposerPrimitive.Send>
        </div>
      </ComposerPrimitive.Root>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col gap-4 px-[var(--thread-padding-x)]">
      <ComposerPrimitive.Root className="bg-muted ml-auto flex w-full max-w-7/8 flex-col rounded-xl">
        <ComposerPrimitive.Input
          className="text-foreground flex min-h-[60px] w-full resize-none bg-transparent p-4 outline-none"
          autoFocus
        />

        <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
          <ComposerPrimitive.Cancel asChild>
            <Button variant="ghost">Cancel</Button>
          </ComposerPrimitive.Cancel>
          <ComposerPrimitive.Send asChild>
            <Button>Send</Button>
          </ComposerPrimitive.Send>
        </div>
      </ComposerPrimitive.Root>
    </div>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "text-muted-foreground inline-flex items-center text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

const StarIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 0L9.79611 6.20389L16 8L9.79611 9.79611L8 16L6.20389 9.79611L0 8L6.20389 6.20389L8 0Z"
      fill="currentColor"
    />
  </svg>
);

const CircleStopIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      width="16"
      height="16"
    >
      <rect width="10" height="10" x="3" y="3" rx="2" />
    </svg>
  );
};

export default Thread;

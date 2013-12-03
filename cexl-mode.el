;;; cexl-mode.el --- Major mode for Cexl code.

;; Copyright 2013 Kris Jenkins

;; Author: Kris Jenkins <krisajenkins@gmail.com>
;; Maintainer: Kris Jenkins <krisajenkins@gmail.com>
;; Keywords: lisp languages
;; URL: https://github.com/krisajenkins/cexl
;; Created: 3rd December 2013
;; Version: 0.1.0

;;; Commentary:
;;
;; A major mode for Cexl.

(require 'lisp-mode)
(require 'font-lock)
(require 'rx)

;;; Code:

(defvar cexl-font-lock-defaults
  `((,(rx "("
          (group "macro")
          (one-or-more whitespace) (group (one-or-more word)))
     (1 font-lock-keyword-face)
     (2 font-lock-function-name-face))
    (,(rx "("
          (group (or "def"))
          (one-or-more (or "\n" whitespace)) (group (one-or-more word)))
     (1 font-lock-keyword-face)
     (2 font-lock-variable-name-face))
    (,(rx "("
          (group (or "if" "quote" "fn"))
	  word-end)
     (1 font-lock-keyword-face))
    ;; Match a single-quoted string, handling escapes, using "Friedl's Unrolled Loop" pattern.
    (,(rx (group "'"
		 (* (not (in "\\'")))
		 (* "\\" anything
		    (* (not (in "\\'"))))
		 "'"))
     (1 font-lock-string-face))
    (,(rx bow (group (or "true" "false" "nil")))
     (1 font-lock-keyword-face))))

;;;###autoload
(define-derived-mode cexl-mode lisp-mode "cexl"
  "Major mode for Cexl"
  (setq font-lock-defaults '(cexl-font-lock-defaults))

  (dolist '(lambda (char)
	     (modify-syntax-entry char "w" cexl-mode-syntax-table))
    '(?_ ?~ ?. ?- ?> ?< ?! ??))

  (setq-local inferior-lisp-program "node lib/repl.js")
  (add-to-list 'comint-preoutput-filter-functions
	       (lambda (output)
		 (replace-regexp-in-string "\033\\[[0-9]+[GJK]" "" output))))

;;;###autoload
(add-to-list 'auto-mode-alist (cons "\\.cexl\\'" 'cexl-mode))

(provide 'cexl-mode)
;;; cexl-mode.el ends here
